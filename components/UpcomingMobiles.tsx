// components/UpcomingMobiles.tsx
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowRight } from "lucide-react";
import { upcomingMobiles } from "@/data/siteData";

export default function UpcomingMobiles() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);
  const dotCount = Math.ceil(upcomingMobiles.length / 2); // ~2 cards per "page" of dots

  const updateActiveDot = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / upcomingMobiles.length;
    const index = Math.round(el.scrollLeft / (cardWidth * 2));
    setActiveDot(Math.min(index, dotCount - 1));
  }, [dotCount]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateActiveDot, { passive: true });
    return () => el.removeEventListener("scroll", updateActiveDot);
  }, [updateActiveDot]);

  const goToDot = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / upcomingMobiles.length;
    el.scrollTo({ left: i * cardWidth * 2, behavior: "smooth" });
  };

  return (
    <section className="w-full rounded-xl bg-white p-4 md:p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            Trending &amp; Latest Launches
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Freshly launched devices, reviewed and scored
          </p>
        </div>
        <Link
          href="#"
          className="flex items-center gap-1 text-sm font-semibold text-red-500 hover:underline whitespace-nowrap"
        >
          View all launches <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth snap-x snap-mandatory"
      >
        {upcomingMobiles.map((m) => (
          <div
            key={m.id}
            className="snap-start shrink-0 w-[170px] rounded-xl border border-gray-100 p-3 hover:shadow-md transition-shadow"
          >
            <Link href="#" className="block">
              <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-gray-50">
                <Image
                  src={m.image}
                  alt={`${m.brand} ${m.name}`}
                  fill
                  sizes="170px"
                  className="object-cover"
                />
              </div>
            </Link>

            <p className="mt-2 text-xs text-gray-400">{m.brand}</p>
            <Link href="#">
              <h3 className="text-sm font-semibold text-gray-900 leading-snug hover:text-blue-600 transition-colors truncate">
                {m.name}
              </h3>
            </Link>
            <p className="text-xs text-gray-400 mt-0.5">{m.launchDate}</p>

            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-sm font-bold text-green-600">
                {m.score}<span className="text-xs font-normal text-gray-400">/100</span>
              </span>
              <span className="text-sm font-bold text-gray-900">
                ₹{m.price.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <button className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-full py-2 transition-colors">
                Compare
              </button>
              <button
                aria-label="Add to wishlist"
                className="w-8 h-8 shrink-0 rounded-full border border-gray-200 flex items-center justify-center hover:border-red-300 transition-colors"
              >
                <Heart className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dot pagination */}
      <div className="flex items-center justify-center gap-1.5 mt-4">
        {Array.from({ length: dotCount }).map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goToDot(i)}
            className={`h-1.5 rounded-full transition-all ${
              activeDot === i ? "w-5 bg-red-500" : "w-1.5 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
} 