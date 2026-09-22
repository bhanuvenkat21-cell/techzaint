"use client";

import { ChevronUp } from "lucide-react";
import type { Phone } from "@/data/siteData";
import { filterConfig } from "@/data/filterConfig";

export type FilterState = {
  minPrice: number;
  maxPrice: number;
  [key: string]: any;
};

export const defaultFilters: FilterState = {
  minPrice: 0,
  maxPrice: 200000,
  ...Object.fromEntries(
    filterConfig.map((f) => [f.key, f.type === "multi" ? [] : f.type === "boolean" ? false : 0])
  ),
};

function FilterBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-base font-bold text-gray-900">{title}</h4>
        <ChevronUp className="w-4 h-4 text-gray-400" />
      </div>
      {children}
    </div>
  );
}

export default function PhoneFilters({
  filters,
  onChange,
  phones,
  resultsCount,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  phones: Phone[];
  resultsCount: number;
}) {
  const toggleMulti = (key: string, value: string | number) => {
    const list: (string | number)[] = filters[key];
    const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
    onChange({ ...filters, [key]: next });
  };

  return (
    <div className="w-full lg:w-[300px] shrink-0">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-lg font-bold text-gray-900">Filter By</h3>
        <button onClick={() => onChange(defaultFilters)} className="text-orange-500 text-sm font-semibold hover:text-orange-600">
          Reset All
        </button>
      </div>

      <FilterBox title="Price">
        <div className="flex items-center gap-2 text-sm mb-4">
          <span className="text-gray-500">₹</span>
          <input type="number" value={filters.minPrice} onChange={(e) => onChange({ ...filters, minPrice: Number(e.target.value) })} className="w-full border border-gray-300 rounded-md px-2 py-1.5" />
          <span className="text-gray-400">-</span>
          <span className="text-gray-500">₹</span>
          <input type="number" value={filters.maxPrice} onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })} className="w-full border border-gray-300 rounded-md px-2 py-1.5" />
        </div>
        <input type="range" min={0} max={200000} step={1000} value={filters.maxPrice} onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })} className="w-full accent-green-600" />
      </FilterBox>

      {filterConfig.map((f) => {
        if (f.type === "multi") {
          const options = [...new Set(phones.map((p) => f.getValue(p)))].sort();
          if (options.length < 2) return null;
          return (
            <FilterBox key={f.key} title={f.label}>
              <div className="space-y-3">
                {options.map((opt) => (
                  <label key={opt} className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer capitalize">
                    <input type="checkbox" checked={filters[f.key].includes(opt)} onChange={() => toggleMulti(f.key, opt)} className="w-4 h-4 accent-orange-500" />
                    {opt}
                  </label>
                ))}
              </div>
            </FilterBox>
          );
        }
        if (f.type === "minThreshold" || f.type === "maxThreshold") {
          return (
            <FilterBox key={f.key} title={f.label}>
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                  <input type="radio" name={f.key} checked={filters[f.key] === 0} onChange={() => onChange({ ...filters, [f.key]: 0 })} className="w-4 h-4 accent-orange-500" />
                  Any
                </label>
                {f.thresholds.map((t) => (
                  <label key={t} className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                    <input type="radio" name={f.key} checked={filters[f.key] === t} onChange={() => onChange({ ...filters, [f.key]: t })} className="w-4 h-4 accent-orange-500" />
                    {t} {f.unit}
                  </label>
                ))}
              </div>
            </FilterBox>
          );
        }
        // boolean
        return (
          <FilterBox key={f.key} title={f.label}>
            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={filters[f.key]} onChange={() => onChange({ ...filters, [f.key]: !filters[f.key] })} className="w-4 h-4 accent-orange-500" />
              Yes
            </label>
          </FilterBox>
        );
      })}

      <p className="text-xs text-gray-400 px-1">{resultsCount} phones match filters</p>
    </div>
  );
}