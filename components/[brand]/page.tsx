import { featuredBrands, getPhonesByBrand } from "@/data/siteData";
import BrandPhoneListing from "@/components/BrandPhoneListing";
import { notFound } from "next/navigation";

export default function BrandPage({ params }: { params: { brand: string } }) {
  const brand = featuredBrands.find((b) => b.slug.toLowerCase() === params.brand.toLowerCase());
  if (!brand) return notFound();

  const phones = getPhonesByBrand(brand.slug);

  return <BrandPhoneListing brandName={brand.name} phones={phones} />;
}