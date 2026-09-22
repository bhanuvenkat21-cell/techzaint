// components/PriceChips.tsx
"use client";

import { useState } from "react";
import { TrendingUp, Check } from "lucide-react";

export default function PriceChips({
  title,
  prices,
}: {
  title: string;
  prices: string[];
}) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-100/80">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-gray-900 tracking-tight">
          {title}
        </h2>
        <span className="flex items-center gap-1 text-xs font-medium text-gray-400">
          <TrendingUp size={13} />
          Most searched
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {prices.map((p) => {
          const isSelected = selected === p;
          const isAbove = p.endsWith("+");
          const label = isAbove ? `Above ${p.replace("+", "")}` : `Under ${p}`;

          return (
            <button
              key={p}
              onClick={() => setSelected(isSelected ? null : p)}
              className={`relative flex items-center justify-center gap-1.5 text-center text-[13px] font-semibold rounded-xl py-3 px-2 border transition-all duration-200 ${
                isSelected
                  ? "bg-brand-orange border-brand-orange text-white shadow-[0_4px_12px_rgba(234,88,12,0.3)]"
                  : "bg-gray-50/60 border-gray-100 text-gray-600 hover:bg-white hover:border-gray-200 hover:shadow-sm hover:-translate-y-0.5"
              }`}
            >
              {isSelected && <Check size={13} strokeWidth={3} />}
              {label}
            </button>
          );
        })}
      </div>

      {selected && (
        <button className="w-full mt-4 bg-gray-900 hover:bg-black transition-colors text-white text-sm font-semibold rounded-xl py-3">
          Show Mobiles {selected.endsWith("+") ? "Above" : "Under"}{" "}
          {selected.replace("+", "")}
        </button>
      )}
    </div>
  );
}