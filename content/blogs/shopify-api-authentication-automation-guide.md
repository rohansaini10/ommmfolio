---
title: "🛍 ️I Spent More Time Fighting Shopify’s Auth Than Writing the Actual Script So Here’s Everything I Learned"
description: "First-person walkthrough of DNS hijacking, Shopify app setup, OAuth tokens, and why Client Secret ≠ Access Token — for any Shopify automation."
date: "2024-02-01"
tags: ["Shopify", "API Authentication", "Node.js", "Web Development", "Developer Experience"]
cover: "https://i.ibb.co/ycshWzPn/shopify-api-authentication-automation-guide.jpg"
---

# I Spent More Time Fighting Shopify's Auth Than Writing the Actual Script — Here's Everything I Learned

A client came to me with a performance problem. They had a Shopify store with over 250 products, and a lot of those product images were sitting well above 1MB each. Page load times were suffering, conversions were likely suffering alongside them, and nobody had noticed until it became hard to ignore.

The fix sounded trivial: write a script that fetches every product image, compresses anything over 200KB down to under 200KB, and re-uploads it — automatically, no manual work, no room for human error. I'd done enough Node.js automation to feel confident spinning this up quickly.

What followed was one of those sessions where the *actual problem* takes about two hours, and getting the script to *talk to the API at all* takes the rest of the week. This article is about that second part — the setup, the errors, the wrong turns, and the lessons. Almost none of this is specific to image compression. This is the Shopify automation foundation work that will apply to nearly any script you ever build against their API.

---

## The Stack (The Easy Part)

Before anything broke, I made some quick decisions on the stack:

- **Node.js v20+** as the runtime
- **TypeScript** with `ts-node` so I could run `.ts` files directly without a build step
- **axios** for HTTP requests, **sharp** for image processing
- **Shopify Admin REST API** as the interface into the store

The script design was clean: paginate through all products, download each image, run it through `sharp` if it's over 200KB, re-upload the compressed version via the API. Fully typed interfaces for all Shopify API shapes. A before/after summary report at the end.

The code was solid. Getting it to *run* was a different story entirely.

---

## Error #1 — `getaddrinfo ENOTFOUND https`

The first run exploded immediately with this:

```
Fatal error: getaddrinfo ENOTFOUND https
```

It took me a second. I'd set my `SHOPIFY_STORE` environment variable to `https://myclient.myshopify.com` — the full URL, copied from the browser. The script was already constructing URLs as `` `https://${STORE}/admin/api/...` ``, so what actually went out was `https://https://myclient.myshopify.com`. DNS tried to resolve `https` as a hostname. It could not.

The fix was a two-liner at the top of the config:

```ts
const STORE = (process.env.SHOPIFY_STORE ?? "")
  .replace(/^https?:\/\//i, "")
  .replace(/\/$/, "");
```

Strip the protocol. Strip the trailing slash. Done. But the lesson here is bigger than the fix — **always sanitize environment variable inputs defensively**. You will paste a full URL at some point. Your future self will paste a full URL. The script should handle it gracefully either way.

---

## Error #2 — `connect ETIMEDOUT` (And Why It Wasn't My Code)

The second run hit this:

```
Fatal error: connect ETIMEDOUT 218.248.112.60:443
```

This one was trickier, because it *looked* like a connectivity issue with the store. I ran a `curl` test to isolate it:

```bash
curl -v --connect-timeout 10 https://myclient.myshopify.com
```

Same timeout. Same IP — `218.248.112.60`.

That IP immediately looked wrong. Shopify runs on Fastly's CDN — you'd expect something in the `151.101.x.x` or `23.227.x.x` range. `218.248.x.x` is not that.

The actual culprit: **DNS hijacking by my ISP**. My ISP was intercepting the DNS resolution and pointing the domain to a local IP instead of Shopify's actual servers. This is surprisingly common in India — Jio, Airtel, and BSNL all do it to varying degrees.

The fix was switching my DNS resolver to Cloudflare (`1.1.1.1`) in system network settings. That bypassed the ISP's DNS entirely and resolved the domain correctly. A VPN or mobile hotspot would have worked just as well.

**The meta-lesson here: `ETIMEDOUT` does not mean your code is broken.** Before you spend an hour reviewing your request logic, run a `curl -v` and check the resolved IP. If it doesn't look like a CDN IP, the problem is your network, not your script. This kind of DNS interference happens globally — but if you're developing in India, it's something you'll hit repeatedly.

---

## The Shopify App Setup Rabbit Hole

Once connectivity worked, I needed actual API credentials. This is where I made my first big architectural mistake.

### Wrong Turn: The Shopify Partners Dashboard

My instinct was to go to the Shopify Partners dashboard and create an app there. It seemed like the "official" way. I built the app, then noticed a **Distribution** section on the app's homepage. I clicked it. Shopify presented two options:

- **Public distribution** — list on the App Store, unlimited installs, Shopify review required
- **Custom distribution** — generate install links for one store, no App Store review

Custom distribution seemed right. I selected it. Shopify showed a warning: *"This can't be undone."* I confirmed. It asked for the store domain, generated a custom install link, I opened it, the app installed on the store.

And I still didn't have a working token.

The problem wasn't the steps — it was that I was in the wrong place entirely. **The Shopify Partners dashboard is for apps meant to be distributed across multiple stores**, even if you eventually lock it to one via custom distribution. It adds a layer of overhead — install links, partner account dependency, distribution settings — that you simply don't need for a private client script.

### The Right Way: Custom Apps in the Store Admin

For any client-specific automation, the correct path is a **Custom App created directly inside the store's own admin**. Here's exactly how:

1. Go to **Shopify Admin → Settings → Apps and sales channels**
2. Click **Develop apps** (you may need to allow custom app development — it's a one-time toggle)
3. Click **Build apps in Dev Dashboard** to open the dev dashboard
4. Click **Create app**, name it something sensible (e.g. `Image Optimizer`), and choose **Start from Dev Dashboard**
5. Under **Configuration → Access Scopes**, add `read_products` and `write_products`
6. Click **Release** — this publishes the app version to the store

This app lives inside one store, is invisible to the App Store, requires no review, and gives you credentials instantly. It is always the right choice for client-specific scripts.

---

## The Token Confusion That Cost Me Hours

After all that setup, I looked at the app credentials screen. I could see a **Client ID** and a **Client Secret**. No access token in sight.

I made the mistake that I suspect almost everyone makes here: I copied the Client Secret and used it as the API token in the `X-Shopify-Access-Token` header. It failed with auth errors. Of course it did.

After digging through the docs, I found what was actually needed: **the access token isn't pre-generated in the UI**. You have to request it programmatically by hitting Shopify's OAuth endpoint with your Client ID and Client Secret:

```
POST https://{shop}.myshopify.com/admin/oauth/access_token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id={your_client_id}
&client_secret={your_client_secret}
```

The response comes back with the actual token:

```json
{
  "access_token": "shpat_xxxxx",
  "scope": "read_products,write_products",
  "expires_in": 86399
}
```

That `shpat_xxxxx` value is what goes into your `SHOPIFY_TOKEN` environment variable. That's the token that goes into every API call header.

Two things worth burning into memory:

**Client Secret ≠ Access Token.** The Client Secret is a credential used *to request* a token. The access token is what you actually use in API calls. They are different things used at different stages.

**Tokens expire after 24 hours.** For any long-running automation or scheduled task, you need to re-hit this OAuth endpoint to get a fresh token before each run. Don't cache it.

---

## Build in Order: Debug → Audit → Optimizer

By the time I had valid credentials and working connectivity, I'd already been burned enough times to know I wasn't going to run the full optimizer directly on a production store. Instead, I built two intermediate scripts first.

**`shopify-debug.ts`** — A pure connectivity tester that runs five progressive checks: DNS resolution, TCP port 443 reachability, HTTPS handshake, API version detection (trying newest-to-oldest), and a final report of exactly where things break. This script told me *precisely* which layer of the chain was failing instead of showing me a vague fatal error.

**`shopify-image-audit.ts`** — A completely read-only script. It fetches all products, checks image sizes using `HEAD` requests where possible, and lists every image over 200KB with its size. It writes nothing to the store. Running this let me verify that auth, connectivity, and pagination were all working correctly, and gave me a clear picture of exactly what the optimizer *would* change before it changed anything.

Only after both of those confirmed everything was solid did I run the actual optimizer.

This order — **debug → audit → write** — is now a hard rule for me on any Shopify automation. Never jump straight to a script that modifies production data. Build the safety net first.

---

## How the Image Compression Actually Works

The compression logic itself uses `sharp` in two stages, in a specific order for a specific reason.

**Stage 1 — Quality reduction.** Start at JPEG quality 85 and step down by 5 until the image is under 200KB:

```ts
let quality = 85;
while (quality >= 20) {
  compressed = await sharp(buffer).jpeg({ quality, progressive: true }).toBuffer();
  if (compressed.length <= TARGET_SIZE_BYTES) return compressed;
  quality -= 5;
}
```

**Stage 2 — Dimension resize.** If quality reduction all the way to 20 still doesn't get it under 200KB, proportionally scale the image dimensions down:

```ts
const scaleFactor = Math.sqrt(TARGET_SIZE_BYTES / compressed.length);
const newWidth = Math.max(Math.floor((metadata.width ?? 1200) * scaleFactor), 400);
compressed = await sharp(buffer)
  .resize({ width: newWidth, withoutEnlargement: true })
  .jpeg({ quality: 75, progressive: true })
  .toBuffer();
```

Quality reduction is nearly invisible to most viewers at reasonable settings. Resizing dimensions is noticeable — things get physically smaller or blurrier. So quality always goes first, and resizing is strictly a last resort.

One more practical detail: Shopify's API allows roughly 2 requests per second. The script adds a 600ms delay between image uploads to stay comfortably within that limit and avoid `429 Too Many Requests` errors. Respect the rate limit. A `429` mid-run on a 250-product store is not a fun recovery.

---

## The Final Project Structure

```
image-optimizer/
├── src/
│   ├── shopify-debug.ts           # Run this first — tests connectivity only
│   ├── shopify-image-audit.ts     # Run this second — read-only size report
│   └── shopify-image-optimizer.ts # Run this last — compresses and re-uploads
├── package.json
└── tsconfig.json
```

Always in that order. No exceptions.

---

## The Lessons, Distilled

If you take nothing else from this, take these:

**`ETIMEDOUT` is not always a code bug.** Run `curl -v` and look at the resolved IP. If it's not a CDN IP, your problem is DNS — switch to `1.1.1.1` or use a VPN.

**Never use the Partners dashboard for client scripts.** Custom Apps created inside the store admin are always the right tool — instant credentials, no review, scoped to one store.

**Client Secret ≠ Access Token.** The secret is used to *request* a token via the OAuth endpoint. The token is what you put in your API calls. Confusing these two will cost you time.

**Tokens expire after 24 hours.** Re-request via OAuth before each automated run.

**Strip environment variable inputs.** Users paste full URLs. Strip the protocol defensively in code.

**Build read-only before write.** Debug script, then audit script, then the script that actually touches data. This order exists for a reason.

**Quality before resize.** When compressing images, always try quality reduction first. Resize is the last resort.

The actual image compression script took maybe two hours to write. Getting it to *connect to Shopify at all* took considerably longer — but every obstacle along the way taught me something I'll carry into every Shopify automation I build from here.

That's usually how it goes.