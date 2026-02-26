---
title: "Building a Robust Reversible Bundle Transformation Engine in Shopify"
description: "How I solved the three-way conflict between merchandising UX, operations accuracy, and checkout correctness — without a backend service or third-party app."
date: "2025-02-01"
tags: ["Shopify", "Ecommerce","Performance Engineering"]
cover: "https://i.ibb.co/0Vv0BrFH/custom-bundle-banner.png"
---

## The Problem No One Tells You About Bundles

When you first hear the requirement — *"we want to sell bundles"* — it sounds straightforward. Put a few products together, wrap them in a bow, charge a price. Done.

It isn't.

The moment you go deeper, you hit a wall that every Shopify developer eventually collides with: **Shopify's inventory model is variant-centric, but bundle UX is representation-centric.** Those two things want fundamentally different things from your cart.

This is the story of how I designed and built a solution that satisfies both — a reversible transformation engine that keeps the customer-facing cart clean and bundled, while sending real, fulfillable component SKUs through to checkout and inventory.

This article is written for Shopify developers. It assumes familiarity with Liquid, the Ajax Cart API, and basic theme architecture. I'll cover the full design rationale, the data contract, the implementation step by step, the tradeoffs I made, and the hardening I'd apply before going to production.

---

## The Business Requirement (And Its Hidden Complexity)

The stated requirement had four parts:

1. Show a bundle as a single product on the PDP with a clean add-to-cart experience.
2. Keep the cart showing one tidy bundle line — not three or four component lines confusing the customer.
3. At checkout, pass real component variant IDs so Shopify decrements inventory correctly.
4. Avoid maintaining a separate inventory model for an abstract "bundle SKU" that doesn't physically exist.

On paper, four clean bullets. In practice, each one creates a constraint that fights the others.

The deeper complexity becomes clear when you think about the full lifecycle of a cart item, not just the PDP moment:

- **PDP**: Customer selects bundle, adds to cart.
- **Cart**: Customer sees one clean line item.
- **Checkout**: Backend needs real purchasable variant IDs — not a synthetic bundle ID.
- **Post-checkout return**: If the customer comes back to the storefront (abandoned checkout, payment failure, etc.), the cart should look bundled again, not like a disassembled pile of components.

Most implementations I've seen solve one or two of these well and quietly break the others. The checkout split is easy. The reconstruction on return is almost always missing.

---

## Why This Is Technically Hard in Shopify

Shopify's checkout and inventory pipeline is built around variants. When checkout fires, Shopify's backend processes line items, decrements inventory, and generates order line items — all at the variant level. There is no native concept of a "bundle variant" that internally maps to multiple inventory units.

That means any bundle abstraction you build in the storefront has to be transparent to Shopify's checkout. The checkout cart must contain real component variant IDs, in real quantities, with real inventory backing.

But your customer doesn't care about any of that. They bought "The Starter Kit." They don't want to see four separate line items in their cart and wonder if they accidentally added duplicates.

So the cart state your customer sees and the cart state Shopify's checkout needs are structurally different. You need a transformation layer that lives between them — one that:

1. Keeps the customer-facing representation intact while the customer is browsing and adding items.
2. Explodes the bundle into components exactly at the moment the customer initiates checkout.
3. Optionally reconstructs the bundle representation when the customer returns to the storefront.

This transformation must be **safe** (can't lose cart items on failure), **reversible** (can reconstruct the original representation), and **invisible** to the customer (all of this happens before the page redirects to checkout).

---

## Important Distinction: Pack UI vs Bundle Engine

Before going further, it's worth clarifying a naming collision that existed in this codebase.

**Pack UI** refers to the PDP display and variant selection experience — the card-style quantity selectors (buy 1 / buy 2 / buy 3) that live in `snippets/product-details.liquid` and are powered by `assets/pdp-custom.js`. This is a presentational layer.

**Bundle transformation** refers to the cart and checkout pipeline — the logic that reads cart state, splits bundle lines into component lines, and rebuilds them on return. This lives entirely in `assets/bundleCartBreaking.js`.

These two systems share a product but operate independently. This article covers only the bundle transformation engine. The Pack UI is a separate concern.

---

## The Architecture: A Three-Layer System

The solution I designed has three distinct layers.

### Layer 1: Data Contract

Every bundle line item in the cart carries a set of private metadata properties. These are Shopify line item properties — a native feature of the Ajax Cart API — with keys prefixed by `_` to mark them as internal and hide them from the customer-facing cart UI.

The contract is:

| Property Key | Purpose | Example Value |
| --- | --- | --- |
| `_Individual Product Variant IDs` | Comma-separated component variant IDs for checkout split | `"44112233,44112244,44112255"` |
| `_Bundle Id` | The bundle's own variant ID, used as grouping key on reconstruction | `"43998877"` |
| `Bundle Name` | Human-readable label for the bundle, used on reconstruction | `"The Starter Kit"` |

These three properties are set at add-to-cart time and travel with the line item throughout the cart lifecycle. They are the single source of truth for every transformation the engine performs.

### Layer 2: Transformation Pipeline

The engine has two directions:

**Forward (cart → checkout):** On checkout click, read the cart, detect bundle lines by the presence of `_Individual Product Variant IDs`, expand each bundle line into its component variant rows, preserve the `_Bundle Id` and `Bundle Name` on each component row (for later reconstruction), clear the cart, re-add all items (expanded components plus untouched non-bundle items), and redirect to `/checkout`.

**Reverse (checkout return → cart):** On storefront load, check for a session flag (`userWentToCheckout`) indicating the user came back from a checkout session. If the flag is present, read the cart (now containing component rows), group component rows by `_Bundle Id`, reconstruct bundle line items with the full `_Individual Product Variant IDs` value, clear the cart, and re-add the reconstructed bundle lines.

### Layer 3: Presentation Filtering

The `_`-prefixed properties are hidden from the customer's cart UI via a filter in `snippets/line-item.liquid`. The line item template loops over properties and skips any key beginning with `_`. The customer only ever sees `Bundle Name` — the friendly label — not the internal IDs.

---

## The Sequence, End to End

Here is the complete lifecycle of a bundle from add-to-cart to checkout to return, visualized as a sequence:

```
┌─────────────────────────────────────────────────────────────┐
│  CUSTOMER                                                   │
│                                                             │
│  1. Opens PDP for "The Starter Kit"                         │
│  2. Clicks "Add to Cart"                                    │
│     └─ Product form submits with hidden properties:         │
│        · _Individual Product Variant IDs: "111,222,333"     │
│        · _Bundle Id: "99887"                                │
│        · Bundle Name: "The Starter Kit"                     │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  CART (Customer View)                                       │
│                                                             │
│  · "The Starter Kit" × 1           £49.00                   │
│    (internal properties hidden)                             │
│                                                             │
│  [Checkout]                                                 │
└─────────────────────────────────────────────────────────────┘
                          │
             Customer clicks [Checkout]
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  BUNDLE TRANSFORMATION ENGINE (Invisible to Customer)       │
│                                                             │
│  1. Fetch GET /cart.js                                      │
│  2. Detect bundle lines via _Individual Product Variant IDs │
│  3. Expand to component rows:                               │
│     · Variant 111 × 1, _Bundle Id: "99887"                  │
│     · Variant 222 × 1, _Bundle Id: "99887"                  │
│     · Variant 333 × 1, _Bundle Id: "99887"                  │
│  4. POST /cart/clear.js                                     │
│  5. POST /cart/add.js (component rows)                      │
│  6. Set sessionStorage: userWentToCheckout = true           │
│  7. Redirect → /checkout                                    │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  SHOPIFY CHECKOUT                                           │
│                                                             │
│  · Product A (Variant 111) × 1                              │
│  · Product B (Variant 222) × 1                              │
│  · Product C (Variant 333) × 1                              │
│                                                             │
│  Inventory decremented at component level ✓                 │
│  Fulfillment sees real SKUs ✓                               │
└─────────────────────────────────────────────────────────────┘
                          │
         Customer abandons or returns to storefront
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  BUNDLE RECONSTRUCTION ENGINE (Invisible to Customer)       │
│                                                             │
│  1. Detect sessionStorage flag: userWentToCheckout          │
│  2. Fetch GET /cart.js (component rows visible)             │
│  3. Group rows by _Bundle Id                                │
│  4. Reconstruct: "The Starter Kit" with IDs "111,222,333"   │
│  5. POST /cart/clear.js                                     │
│  6. POST /cart/add.js (bundle row)                          │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  CART (Customer View — Back to Bundle Representation)       │
│                                                             │
│  · "The Starter Kit" × 1           £49.00                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation: Step by Step

### Step 0: Define the Bundle Metafield

Before any code, set up the data model that connects a bundle product to its component products in Shopify Admin.

Create a product metafield:

- **Owner type:** Product
- **Namespace:** `custom`
- **Key:** `bundle_components`
- **Type:** `list.product_reference`

The `list.product_reference` type is a native Shopify metafield type that stores references to other product objects. Its `.value` in Liquid returns an iterable of product objects, which means you can loop over component products and resolve their current default variants without any Ajax calls.

Only apply this metafield to products that are bundles. Non-bundle products leave it empty and the engine ignores them entirely.

### Step 1: Populate Metafield in Admin

For each bundle product:

1. Open the product in Admin.
2. Scroll to the metafields section.
3. Fill `custom.bundle_components` with the component products.
4. Save.

This is the merchant-facing configuration interface. No code is needed here. The metafield UI handles the product picker.

### Step 2: Include the Bundle Script Globally

In `layout/theme.liquid`, include the bundle engine near your other global JavaScript:

```html
<script src="{{ 'bundleCartBreaking.js' | asset_url }}" defer></script>
```

The `defer` attribute ensures the DOM is available before the script initializes event listeners. This must be a global include — not scoped to the product template — because checkout button listeners need to be present on the cart drawer and cart page as well.

### Step 3: Wire Checkout Button Hooks

The bundle engine needs to intercept checkout before the page redirects. It does this by listening to clicks on checkout buttons.

The existing script uses these selectors:

```jsx
#ddCheckoutButton          // Cart drawer checkout
.ddCartPageCheckoutBtn     // Cart page checkout
.ddBuyNowButton            // Buy now
```

These need to match your actual checkout buttons. If your theme uses different selectors (for example, a GoKwik checkout button), you have two options:

**Option A:** Add the expected IDs or classes to your existing buttons.

**Option B:** Update the selectors in `bundleCartBreaking.js` to match your actual buttons.

The more robust approach for any theme is to use stable `data-*` attributes instead of class names or IDs, which are more likely to change across theme updates:

```html
<button data-role="bundle-checkout">Checkout</button>
```

```jsx
document.querySelectorAll('[data-role="bundle-checkout"]')
```

This decouples the bundle engine from the visual/styling layer of your buttons.

### Step 4: Inject Bundle Properties into the Product Form

In `snippets/buy-buttons.liquid`, inside the `{% form 'product' %}` block, add hidden inputs for the three bundle properties:

```html
{% if product.metafields.custom.bundle_components != blank %}
  <input
    type="hidden"
    name="properties[_Bundle Id]"
    value="{{ product.selected_or_first_available_variant.id }}"
  >
  <input
    type="hidden"
    name="properties[Bundle Name]"
    value="{{ product.title | escape }}"
  >
  <input
    type="hidden"
    name="properties[_Individual Product Variant IDs]"
    id="bundle-component-ids"
    value=""
  >
{% endif %}
```

The conditional `{% if product.metafields.custom.bundle_components != blank %}` ensures these properties are only added for bundle products. Non-bundle products go through the normal add-to-cart flow untouched.

The `_Individual Product Variant IDs` input starts empty. It will be populated by the next step.

### Step 5: Resolve Component Variant IDs at Page Load

The hidden input for component variant IDs needs to be populated with the actual variant IDs of the bundle's component products. You resolve these from the metafield.

Add this Liquid and JavaScript to the product template or buy-buttons snippet:

```
{% if product.metafields.custom.bundle_components != blank %}
  {% assign component_ids = '' %}
  {% for component_product in product.metafields.custom.bundle_components.value %}
    {% assign variant_id = component_product.selected_or_first_available_variant.id %}
    {% assign component_ids = component_ids | append: variant_id %}
    {% unless forloop.last %}
      {% assign component_ids = component_ids | append: ',' %}
    {% endunless %}
  {% endfor %}

  <script>
    document.addEventListener('DOMContentLoaded', function () {
      var el = document.getElementById('bundle-component-ids');
      if (el && !el.value) {
        el.value = "{{ component_ids }}";
      }
    });
  </script>
{% endif %}
```

This resolves the default/first-available variant for each component product at page load. The resulting comma-separated string — for example `"44112233,44112244,44112255"` — gets written into the hidden input before the customer clicks "Add to Cart."

**Important edge case:** If your bundle variant options determine which component variant gets added (for example, a bundle size "M/L" maps to the Medium variant of Product A and the Large variant of Product B), this static Liquid resolution won't be sufficient. You'll need a JavaScript mapping table that listens to variant change events and updates the component IDs dynamically:

```jsx
// Example mapping: bundle variant ID → component variant IDs
var bundleVariantMap = {
  "43001122": "44112233,44112244",   // Bundle size S/M
  "43001133": "44112255,44112266",   // Bundle size L/XL
};

document.addEventListener('variantChanged', function (e) {
  var ids = bundleVariantMap[e.detail.variantId] || '';
  document.getElementById('bundle-component-ids').value = ids;
});
```

For fixed-composition bundles with no variant options, the Liquid-only approach works cleanly.

### Step 6: Cart UI Hides Internal Properties

This step is already implemented via `snippets/line-item.liquid`. The template loops over line item properties and skips any key beginning with `_`:

```
{% for property in item.properties %}
  {% unless property.first == blank or property.first contains '_' %}
    <div class="cart-item__property">
      <span>{{ property.first }}:</span>
      <span>{{ property.last }}</span>
    </div>
  {% endunless %}
{% endfor %}
```

The customer only sees `Bundle Name` in the cart. The `_Bundle Id` and `_Individual Product Variant IDs` values are invisible.

### Step 7: The Checkout Split Pipeline

This is the core of the engine. When the customer clicks checkout, `bundleCartBreaking.js` intercepts the click and runs the transformation:

```jsx
async function breakBundlesForCheckout() {
  // 1. Fetch current cart
  const cartResponse = await fetch('/cart.js');
  const cart = await cartResponse.json();

  // 2. Determine if any bundles exist
  const hasBundles = cart.items.some(item =>
    item.properties && item.properties['_Individual Product Variant IDs']
  );

  if (!hasBundles) {
    // No bundles — proceed to checkout normally
    window.location.href = '/checkout';
    return;
  }

  // 3. Build expanded item list
  const expandedItems = [];

  cart.items.forEach(item => {
    const componentIds = item.properties['_Individual Product Variant IDs'];

    if (componentIds) {
      // Bundle item — split into components
      const ids = componentIds.split(',').map(id => id.trim());
      ids.forEach(variantId => {
        expandedItems.push({
          id: parseInt(variantId),
          quantity: item.quantity,  // Multiply component qty by bundle qty
          properties: {
            '_Bundle Id': item.properties['_Bundle Id'],
            'Bundle Name': item.properties['Bundle Name']
            // Note: _Individual Product Variant IDs intentionally excluded
          }
        });
      });
    } else {
      // Non-bundle item — pass through unchanged
      expandedItems.push({
        id: item.variant_id,
        quantity: item.quantity,
        properties: item.properties
      });
    }
  });

  // 4. Clear cart
  await fetch('/cart/clear.js', { method: 'POST' });

  // 5. Re-add expanded items
  await fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: expandedItems })
  });

  // 6. Set session flag for return reconstruction
  sessionStorage.setItem('userWentToCheckout', 'true');

  // 7. Redirect to checkout
  window.location.href = '/checkout';
}
```

The critical detail in step 3 is that `_Individual Product Variant IDs` is **not** included on the component rows. Each component row only carries `_Bundle Id` and `Bundle Name`. This is what allows the reconstruction to work on return — the absence of `_Individual Product Variant IDs` on a row signals "this is a component, not a bundle."

### Step 8: Reconstruct Bundles on Return

On every storefront page load, the engine checks for the `userWentToCheckout` session flag:

```jsx
document.addEventListener('DOMContentLoaded', async function () {
  const wentToCheckout = sessionStorage.getItem('userWentToCheckout');
  if (!wentToCheckout) return;

  // Clear the flag immediately to prevent re-running on next page load
  sessionStorage.removeItem('userWentToCheckout');

  await undoCartBreaking();
});

async function undoCartBreaking() {
  const cartResponse = await fetch('/cart.js');
  const cart = await cartResponse.json();

  // Group component items by _Bundle Id
  const bundleGroups = {};
  const nonBundleItems = [];

  cart.items.forEach(item => {
    const bundleId = item.properties && item.properties['_Bundle Id'];
    const hasComponentIds = item.properties && item.properties['_Individual Product Variant IDs'];

    if (bundleId && !hasComponentIds) {
      // This is a component row (has bundle ID but no component IDs list)
      if (!bundleGroups[bundleId]) {
        bundleGroups[bundleId] = {
          bundleId: bundleId,
          bundleName: item.properties['Bundle Name'],
          variantIds: [],
          quantity: item.quantity
        };
      }
      bundleGroups[bundleId].variantIds.push(item.variant_id);
    } else {
      nonBundleItems.push({
        id: item.variant_id,
        quantity: item.quantity,
        properties: item.properties
      });
    }
  });

  // If no bundle groups found, nothing to reconstruct
  if (Object.keys(bundleGroups).length === 0) return;

  // Build reconstructed bundle items
  const reconstructedItems = [...nonBundleItems];

  Object.values(bundleGroups).forEach(group => {
    reconstructedItems.push({
      id: parseInt(group.bundleId),
      quantity: group.quantity,
      properties: {
        '_Bundle Id': group.bundleId,
        'Bundle Name': group.bundleName,
        '_Individual Product Variant IDs': group.variantIds.join(',')
      }
    });
  });

  // Clear and rebuild
  await fetch('/cart/clear.js', { method: 'POST' });
  await fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: reconstructedItems })
  });

  // Trigger cart refresh event so drawer/page updates
  document.dispatchEvent(new CustomEvent('cart:refresh'));
}
```

---

## Why This Avoids Separate Bundle Inventory

The key insight in this architecture is that the **bundle product never enters the checkout cart**. The bundle variant is used as a cart representation vehicle and a grouping key — nothing more. Shopify's checkout always receives real component variant IDs.

This means:

- Shopify decrements inventory against component variants, not a synthetic bundle SKU.
- Fulfillment receives real, physically pickable SKUs.
- You never have to maintain a shadow inventory model for bundles.
- The bundle product can have `"Continue selling when out of stock"` enabled without consequence — stock is enforced at the component level.

This is the primary operational win. Merchandising gets their clean single-SKU bundle product on the storefront. Operations gets clean per-SKU inventory movement. Neither team has to compromise.

---

## Tradeoffs and Why This Pattern Was Worth It

No architecture is without tradeoffs. I want to be transparent about where the risks are.

**The risk in `clear + add`:** The transformation involves clearing the entire cart before re-adding. If the `POST /cart/add.js` call fails after the clear, the customer's cart is empty. This is the single most dangerous moment in the pipeline. It requires a robust failure rollback strategy (covered in the hardening section below).

**Checkout button coverage must be exhaustive:** If there is a checkout path you haven't wired the bundle engine to — a secondary checkout button, a third-party checkout widget — bundles will slip through un-split. This requires deliberate QA across all cart entry points.

**More complex QA surface:** Compared to a simple product, a bundle with this transformation engine has significantly more states to test. The test matrix is real work.

**But the alternative is worse:** The common alternative — maintaining a separate bundle SKU with its own inventory that you then sync to component products — creates a permanent operational burden. Someone has to keep bundle inventory in sync with component inventory at all times. Overselling becomes a real risk. Fulfillment teams deal with phantom SKUs. This architecture front-loads engineering complexity in exchange for operational simplicity at scale. For stores running bundles as a significant revenue line, that's the right trade.

---

## Production Hardening Checklist

The core engine works. Before taking it to production, here is what I would implement:

**1. Preserve cart note and attributes across transformation**

During `clear + add`, Shopify loses `cart.note` and `cart.attributes`. Read them before clearing and restore them via `/cart/update.js` after the re-add:

```jsx
const cart = await fetch('/cart.js').then(r => r.json());
const cartNote = cart.note;
const cartAttributes = cart.attributes;

// ... clear and re-add ...

await fetch('/cart/update.js', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ note: cartNote, attributes: cartAttributes })
});
```

**2. Failure rollback**

Snapshot the cart before transformation. If the add fails after clear, restore from snapshot:

```jsx
const snapshot = JSON.parse(JSON.stringify(cart.items)); // Deep copy before clear

try {
  await fetch('/cart/clear.js', { method: 'POST' });
  await fetch('/cart/add.js', { ... });
} catch (err) {
  // Restore snapshot
  await fetch('/cart/add.js', {
    method: 'POST',
    body: JSON.stringify({ items: snapshot.map(/* map to add format */) })
  });
  console.error('Bundle split failed, cart restored:', err);
  return; // Do not redirect to checkout
}
```

**3. Button idempotency**

Disable checkout buttons during transformation to prevent double-clicks triggering duplicate pipeline runs:

```jsx
button.disabled = true;
button.textContent = 'Processing...';
// Re-enable only on failure
```

**4. Skip non-bundle carts gracefully**

Check for bundles before running any transformation. If no bundle lines are present, skip the entire pipeline and redirect directly:

```jsx
if (!hasBundles) {
  window.location.href = '/checkout';
  return;
}
```

**5. Quantity multiplication**

When a customer adds a bundle with quantity 2, each component should also be added with quantity 2. Make sure the expansion step uses `item.quantity` for component quantities.

**6. Feature flag for gradual rollout**

Gate the entire engine behind a theme setting to enable safe rollout:

In `config/settings_schema.json`:

```json
{
  "type": "checkbox",
  "id": "enable_bundle_split_checkout",
  "label": "Enable bundle split at checkout",
  "default": false
}
```

In `layout/theme.liquid`:

```
{% if settings.enable_bundle_split_checkout %}
  <script src="{{ 'bundleCartBreaking.js' | asset_url }}" defer></script>
{% endif %}
```

Enable on staging first, validate against the full test matrix, then enable on production.

**7. Use stable `data-*` hooks**

Replace class-based or ID-based checkout button selectors with `data-role` attributes. CSS classes change with theme updates. `data-*` attributes are yours to control.

---

## QA Test Matrix

Run every case in this matrix before launch.

### Functional Tests

| Test Case | Expected Outcome |
| --- | --- |
| Add bundle to cart | One cart line with all three private properties set |
| View cart | `_`-prefixed properties hidden, `Bundle Name` visible |
| Checkout from cart drawer | Cart splits, checkout receives component variants |
| Checkout from cart page | Same as above |
| Buy now flow | Same as above, single item path |
| Return after checkout | Cart reconstructs bundle representation |
| Non-bundle product in cart | Passes through checkout transformation untouched |

### Quantity Tests

| Test Case | Expected Outcome |
| --- | --- |
| Bundle qty = 1 | Each component qty = 1 |
| Bundle qty = 2 | Each component qty = 2 |
| Bundle qty = 1 + normal product qty = 2 | Bundle splits correctly, normal product unchanged |
| Update bundle qty in cart before checkout | Correct qty passed to split |

### Error / Edge Cases

| Test Case | Expected Outcome |
| --- | --- |
| `/cart/clear.js` fails | Cart unchanged, user shown error, not redirected |
| `/cart/add.js` fails after clear | Snapshot restored, user shown error |
| `_Individual Product Variant IDs` is empty | Skip split, proceed to checkout normally |
| Component variant out of stock | Handle gracefully, surface error before checkout |

### Regression Tests

| Test Case | Expected Outcome |
| --- | --- |
| GoKwik / third-party checkout button still works | Bundle split fires before redirect |
| Cart drawer refresh event fires after reconstruction | Drawer reflects updated cart without page reload |
| Cart note preserved through transformation | Note intact after checkout and return |

---

## What I Would Do Differently If Rebuilding Today

This architecture is sound, but with the benefit of hindsight there are several things I'd approach differently.

**Consolidate split and reconstruct into a single module.** The current implementation has the two directions of transformation somewhat spread across the file. I'd build a single `BundleCartEngine` module with clearly named methods: `splitForCheckout()` and `reconstructFromReturn()`. This makes the code dramatically easier to reason about and test in isolation.

**Add structured telemetry.** Every transformation step should emit an event — split initiated, split complete, split failed, reconstruction initiated, reconstruction complete. This data is invaluable when debugging production issues. Even a simple `console.group` / `console.groupEnd` structured log with timestamps helps enormously.

**Use deterministic transaction IDs.** When the split fires, generate a UUID and attach it to all the component rows as a property. This gives you a way to trace a specific checkout event end-to-end if something goes wrong.

**Introduce a proper state machine.** The current implementation has implicit states (cart is bundle-native, cart is component-native, transformation in progress). Making these explicit with an enum and enforced transitions removes entire categories of race condition bugs.

**Stronger button hook contracts.** Using `data-role="bundle-checkout"` as a convention across all checkout-adjacent buttons, documented in a theme README, means future developers can add new checkout entry points without breaking the bundle engine.

---

## What This Implementation Demonstrates

I've found this project comes up frequently in technical conversations, and the reason is that it touches almost every layer of the Shopify theme stack simultaneously.

It required:

- Understanding how Shopify's Ajax Cart API and line item properties work at a protocol level.
- Building a two-directional transformation pipeline that can safely mutate and restore cart state.
- Designing a data contract (the three-property bundle metadata schema) that is deterministic and survives round-trips through Shopify's cart storage.
- Working with Shopify's metafield data model to create a merchant-facing configuration interface.
- Navigating the gap between what Shopify's storefront presents and what Shopify's checkout requires.

If I had to describe it in one sentence: **I built a reversible bundle transformation engine where the cart stays bundle-native for UX, checkout stays SKU-native for inventory truth, and merchant configuration stays metafield-native for scalability — all within Shopify's native primitives, with no backend service required.**

---

## References

- [Shopify Cart Ajax API — private line item properties and cart endpoints](https://shopify.dev/docs/api/ajax/reference/cart)
- [Shopify product template docs — line item properties in product forms](https://shopify.dev/docs/storefronts/themes/architecture/templates/product/overview)
- [Shopify metafield object — list `.value` behavior in Liquid](https://shopify.dev/docs/api/liquid/objects/metafield)
- [Shopify metafield data types — `list.product_reference`](https://shopify.dev/docs/apps/build/metafields/list-of-data-types)