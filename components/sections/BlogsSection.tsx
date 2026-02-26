import { SectionHeading } from "@/components/SectionHeading";
import { Compass } from "lucide-react";
import Link from "next/link";

export function BlogsSection() {
  return (
    <div className="h-full w-full">
      <SectionHeading title="Blogs" />

      <div className="mt-3 flex flex-wrap items-start leading-[180%]">
        <h4>Where I share systems, builds, and lessons from real work.</h4>
        <Link href="/blog"
          data-analytics-label="📄 Read My Blogs Page [Link Click]"
        >
          <div className="group mx-2 flex flex-1! items-center border-b-2 border-dashed border-[#e9ecef] text-black transition duration-300 hover:border-black hover:text-[#333]">
            <h3 className="undefined whitespace-nowrap font-semibold italic">My Blogs</h3>
            <div className="ml-2 flex h-[22px] w-[22px] items-center justify-center rounded bg-linear-to-br from-amber-400 to-orange-500">
              <Compass className="h-3.5 w-3.5 text-white" strokeWidth={2.25} />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
