import { featuredBrands, getPhonesByBrand } from "@/data/siteData";
import BrandPhoneListing from "@/components/BrandPhoneListing";
import PhoneFinderTable from "@/components/PhoneFinderTable";
import { notFound } from "next/navigation";


export default function BrandPage({ params }: { params: { brand: string } }) {
  const brand = featuredBrands.find((b) => b.slug.toLowerCase() === params.brand.toLowerCase());
  if (!brand) return notFound();

  const phones = getPhonesByBrand(brand.slug);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
      <PhoneFinderTable phones={phones} />
      <BrandPhoneListing brandName={brand.name} phones={phones} />
    </div>
  );
}