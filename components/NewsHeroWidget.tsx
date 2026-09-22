// components/NewsHeroWidget.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { heroNews } from "@/data/siteData";

const PAGE_SIZE = 4;

export default function NewsHeroWidget() {
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(heroNews.length / PAGE_SIZE);

  const start = page * PAGE_SIZE;
  const current = heroNews.slice(start, start + PAGE_SIZE);
  const [hero, ...sidebar] = current;

  const goPrev = () => setPage((p) => (p - 1 + pageCount) % pageCount);
  const goNext = () => setPage((p) => (p + 1) % pageCount);

  if (!hero) return null;

  return (
    <div className="w-full rounded-xl bg-white p-4 md:p-5 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
        {/* Left: hero item */}
        <div className="flex flex-col">
          <Link
            href={hero.href}
            className="relative block w-full overflow-hidden rounded-lg bg-gray-100 aspect-[16/10] md:aspect-[16/9]"
          >
            <Image
              src={hero.image}
              alt={hero.title}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
              priority
            />
          </Link>
          <div className="mt-3">
            <p className="text-xs text-gray-500">{hero.date}</p>
            <Link href={hero.href}>
              <h3 className="mt-1 text-lg md:text-xl font-bold text-gray-900 leading-snug hover:text-blue-600 transition-colors">
                {hero.title}
              </h3>
            </Link>
          </div>
        </div>

        {/* Right: sidebar list */}
        <div className="flex flex-col">
          <div className="flex flex-col divide-y divide-gray-200">
            {sidebar.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex gap-4 py-4 first:pt-0 group"
              >
                <div className="relative shrink-0 w-24 h-20 rounded-md overflow-hidden bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-xs text-gray-500">{item.date}</p>
                  <h4 className="mt-1 text-sm md:text-base font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>

          {pageCount > 1 && (
            <div className="mt-auto pt-3 flex justify-end gap-2 border-t border-gray-100">
              <button
                aria-label="Previous"
                onClick={goPrev}
                className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                aria-label="Next"
                onClick={goNext}
                className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-black transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
