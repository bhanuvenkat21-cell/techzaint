// components/FeaturedComparisons.tsx
import Link from "next/link";
import Image from "next/image";
import { featuredComparisons } from "@/data/siteData";
import ScrollRail from "./ScrollRail";

export default function FeaturedComparisons() {
  return (
    <ScrollRail title="Featured Mobile Comparisons" seeAllHref="#">
      {featuredComparisons.map((c) => (
        <Link
          key={c.id}
          href="#"
          className="snap-start shrink-0 w-[300px] flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-lg p-3 hover:shadow-md transition-shadow"
        >
          <div className="relative w-16 h-20 rounded-md overflow-hidden bg-white shrink-0">
            <Image src={c.imageA} alt={c.phoneA} fill sizes="64px" className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 leading-snug truncate">
              {c.phoneA}
            </p>
          </div>

          <span className="shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white text-[11px] font-bold flex items-center justify-center">
            VS
          </span>

          <div className="flex-1 min-w-0 text-right">
            <p className="text-sm font-semibold text-gray-800 leading-snug truncate">
              {c.phoneB}
            </p>
          </div>
          <div className="relative w-16 h-20 rounded-md overflow-hidden bg-white shrink-0">
            <Image src={c.imageB} alt={c.phoneB} fill sizes="64px" className="object-cover" />
          </div>
        </Link>
      ))}
    </ScrollRail>
  );
}
