// components/BestOfSection.tsx
"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  Smartphone,
  Camera,
  Gamepad2,
  Aperture,
  Laptop,
  Cpu,
  ChevronRight,
} from "lucide-react";
import type { BestOfCategory } from "@/data/siteData";

const ICONS = {
  smartphone: Smartphone,
  camera: Camera,
  gaming: Gamepad2,
  selfie: Aperture,
  laptop: Laptop,
  gaminglaptop: Cpu,
} as const;

export default function BestOfSection({
  title,
  categories,
  prices,
}: {
  title: string;
  categories: BestOfCategory[];
  prices: string[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = () => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.85, behavior: "smooth" });
  };

  const gridCols =
    categories.length >= 4 ? "sm:grid-cols-4" : "sm:grid-cols-2";

  return (
    <section className="w-full rounded-xl bg-white p-5 shadow-sm">
      <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
        {title}
      </h2>

      <div className={`grid grid-cols-2 ${gridCols} gap-3 mb-3`}>
        {categories.map((c) => {
          const Icon = ICONS[c.icon];
          return (
            <Link
              key={c.label}
              href="#"
              className={`flex items-center gap-3 rounded-lg border border-gray-100 ${c.bg} px-4 py-5 hover:shadow-md transition-shadow`}
            >
              <span className="w-9 h-9 rounded-full bg-white/70 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-gray-700" />
              </span>
              <span className="text-sm font-semibold text-gray-800">
                {c.label}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="relative">
        <div
          ref={trackRef}
          className="flex gap-3 overflow-x-auto scrollbar-none scroll-smooth"
        >
          {prices.map((p) => (
            <Link
              key={p}
              href="#"
              className="shrink-0 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-100 rounded-lg px-5 py-3 hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              {p}
            </Link>
          ))}
        </div>
        <button
          aria-label="Next"
          onClick={scroll}
          className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-700 text-white items-center justify-center shadow hover:bg-black transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}
