import { phones } from "@/data/siteData";
import PhoneFinderTable from "@/components/PhoneFinderTable";
import BrandPhoneListing from "@/components/BrandPhoneListing";

export default function FinderPage({
  searchParams,
}: {
  searchParams: { maxPrice?: string; minPrice?: string; q?: string };
}) {
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined;
  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined;
  const q = searchParams.q?.trim().toLowerCase();

  let filteredPhones = phones;

  if (maxPrice !== undefined && !Number.isNaN(maxPrice)) {
    filteredPhones = filteredPhones.filter((p) => p.price <= maxPrice);
  }
  if (minPrice !== undefined && !Number.isNaN(minPrice)) {
    filteredPhones = filteredPhones.filter((p) => p.price >= minPrice);
  }
  if (q) {
    filteredPhones = filteredPhones.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
  }

  const hasActiveFilter = maxPrice !== undefined || minPrice !== undefined || !!q;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {hasActiveFilter && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
          <span>
            {maxPrice !== undefined && <>Showing phones under ₹{maxPrice.toLocaleString("en-IN")}</>}
            {minPrice !== undefined && <> and above ₹{minPrice.toLocaleString("en-IN")}</>}
            {q && <> matching &ldquo;{searchParams.q}&rdquo;</>}
            {" — "}
            {filteredPhones.length} result{filteredPhones.length !== 1 ? "s" : ""}
          </span>
          <a href="/mobiles/finder" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Clear filter
          </a>
        </div>
      )}

      <PhoneFinderTable phones={filteredPhones} />
      <BrandPhoneListing brandName="All" phones={phones} />
    </div>
  );
}
