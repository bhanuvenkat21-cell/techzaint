// components/ScrollRail.tsx
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ScrollRailProps = {
  title: string;
  seeAllHref?: string;
  children: React.ReactNode;
};

export default function ScrollRail({ title, seeAllHref, children }: ScrollRailProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section className="w-full rounded-xl bg-white p-4 md:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold text-gray-900">{title}</h2>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="hidden sm:flex items-center gap-0.5 text-sm font-semibold text-brand-orange hover:underline"
          >
            View All <ChevronRight size={16} />
          </Link>
        )}
      </div>

      <div className="relative">
        {canScrollLeft && (
          <button
            aria-label="Previous"
            onClick={() => scroll(-1)}
            className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-gray-700 text-white items-center justify-center shadow hover:bg-black transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
        )}

        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth snap-x snap-mandatory"
        >
          {children}
        </div>

        {canScrollRight && (
          <button
            aria-label="Next"
            onClick={() => scroll(1)}
            className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-gray-700 text-white items-center justify-center shadow hover:bg-black transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </section>
  );
}