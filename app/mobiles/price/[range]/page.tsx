// app/mobiles/price/[range]/page.tsx
// Route: /mobiles/price/8000-12000, /mobiles/price/above-25000, /mobiles/price/under-15000, etc.
// Handles every price-range href used in siteData.ts (megaMenus "Price Range" column,
// and the Top10 "Best Phones By Prices" list).

import { notFound } from "next/navigation";
import { phones } from "@/data/siteData";
import BrandPhoneListing from "@/components/BrandPhoneListing";
import PhoneFinderTable from "@/components/PhoneFinderTable";

function parseRange(range: string): { min: number; max: number; label: string } | null {
  const slug = range.toLowerCase();

  // "above-25000"
  const aboveMatch = slug.match(/^above-(\d+)$/);
  if (aboveMatch) {
    const min = Number(aboveMatch[1]);
    return { min, max: Infinity, label: `Above ₹${min.toLocaleString("en-IN")}` };
  }

  // "under-10000" / "under-30000"
  const underMatch = slug.match(/^under-(\d+)$/);
  if (underMatch) {
    const max = Number(underMatch[1]);
    return { min: 0, max, label: `Under ₹${max.toLocaleString("en-IN")}` };
  }

  // "8000-12000" / "12000-25000"
  const betweenMatch = slug.match(/^(\d+)-(\d+)$/);
  if (betweenMatch) {
    const min = Number(betweenMatch[1]);
    const max = Number(betweenMatch[2]);
    return {
      min,
      max,
      label: `₹${min.toLocaleString("en-IN")} - ₹${max.toLocaleString("en-IN")}`,
    };
  }

  return null;
}

export default function PriceRangePage({ params }: { params: { range: string } }) {
  const parsed = parseRange(params.range);
  if (!parsed) return notFound();

  const filteredPhones = phones.filter(
    (p) => p.price >= parsed.min && p.price <= parsed.max
  );

  return (
    <div className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
      <PhoneFinderTable phones={filteredPhones} />
      <BrandPhoneListing brandName={`Mobiles ${parsed.label}`} phones={filteredPhones} />
    </div>
  );
}
