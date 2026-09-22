// components/BuyCategories.tsx
import Link from "next/link";
import { Smartphone, Laptop, Tablet, Tv, ArrowUpRight } from "lucide-react";
import { buyCategories } from "@/data/siteData";

const ICONS = {
  smartphone: Smartphone,
  laptop: Laptop,
  tablet: Tablet,
  tv: Tv,
} as const;

const ICON_STYLES: Record<string, string> = {
  smartphone: "bg-gradient-to-br from-orange-400 to-orange-500 text-white",
  laptop: "bg-gradient-to-br from-blue-400 to-blue-500 text-white",
  tablet: "bg-gradient-to-br from-violet-400 to-violet-500 text-white",
  tv: "bg-gradient-to-br from-rose-400 to-rose-500 text-white",
};

export default function BuyCategories() {
  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-100/80">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
          What Are You Looking to Buy?
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {buyCategories.map((c) => {
          const Icon = ICONS[c.icon];
          return (
            <Link
              key={c.label}
              href="#"
              className="group relative flex flex-col justify-between gap-6 rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-4 hover:bg-white hover:border-gray-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 ease-out"
            >
              <div className="flex items-start justify-between">
                <span className={`flex items-center justify-center w-10 h-10 rounded-xl shadow-sm ${ICON_STYLES[c.icon]}`}>
                  <Icon size={18} strokeWidth={2} />
                </span>
                <ArrowUpRight
                  size={15}
                  className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                />
              </div>
              <span className="text-sm font-semibold text-gray-800 tracking-tight">
                {c.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}