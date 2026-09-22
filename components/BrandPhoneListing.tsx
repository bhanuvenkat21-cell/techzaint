"use client";

import { useState } from "react";
import type { Phone } from "@/data/siteData";
import PhoneFilters, { defaultFilters, FilterState } from "./PhoneFilters";
import PhoneCard from "./PhoneCard";
import { filterConfig } from "@/data/filterConfig";
import SideBanner from "./SideBanner";

export default function BrandPhoneListing({ brandName, phones }: { brandName: string; phones: Phone[] }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const filtered = phones.filter((p) => {
    if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
    for (const f of filterConfig) {
      const val = filters[f.key];
      if (f.type === "multi" && val.length && !val.includes(f.getValue(p))) return false;
      if (f.type === "minThreshold" && val && f.getValue(p) < val) return false;
      if (f.type === "maxThreshold" && val && f.getValue(p) > val) return false;
      if (f.type === "boolean" && val && !f.getValue(p)) return false;
    }
    return true;
  });

  return (
    <div className="relative">
      <SideBanner side="left" />
      <SideBanner side="right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-gray-900">{brandName} Mobiles</h1>
          <p className="text-sm text-gray-600">
            <span className="font-bold text-gray-900">{filtered.length}</span> Phones Found
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <PhoneFilters filters={filters} onChange={setFilters} phones={phones} resultsCount={filtered.length} />
          <div className="flex-1">
            {filtered.length === 0 ? (
              <p className="text-gray-500 py-12 text-center">No phones match the selected filters.</p>
            ) : (
              filtered.map((phone) => <PhoneCard key={phone.id} phone={phone} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}