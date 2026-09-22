"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { featuredLaptopBrands } from "@/data/laptopData";
import { ChevronRight, ChevronUp } from "lucide-react";

export default function FeaturedLaptopBrands() {
  const [expanded, setExpanded] = useState(false);

  // duplicate the list so the marquee loop is seamless (second half = first half)
  const loopBrands = [...featuredLaptopBrands, ...featuredLaptopBrands];

  const BrandCard = ({ b }: { b: (typeof featuredLaptopBrands)[number] }) => (
    <Link
      href={`/laptops/${b.slug}`}
      className="shrink-0 w-[120px] flex flex-col items-center gap-2 group"
    >
      <div className="relative w-[120px] h-[120px] rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center p-4 group-hover:border-gray-300 transition-colors">
        <Image
          src={b.image}
          alt={b.name}
          fill
          sizes="120px"
          className="object-contain p-4"
        />
      </div>
      <span className="text-sm text-gray-700">{b.name}</span>
    </Link>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Featured Laptop Brands</h2>
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600"
        >
          {expanded ? "Show Less" : "View All"}
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>

      {expanded ? (
        <div className="flex flex-wrap gap-4 pt-1">
          {featuredLaptopBrands.map((b) => (
            <BrandCard key={b.slug} b={b} />
          ))}
        </div>
      ) : (
        <>
          {/* fade edges */}
          <div className="pointer-events-none absolute left-0 top-[76px] bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-[76px] bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10" />

          <div className="overflow-hidden">
            <div className="flex gap-4 w-max animate-marquee">
              {loopBrands.map((b, i) => (
                <BrandCard key={`${b.slug}-${i}`} b={b} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
