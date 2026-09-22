// app/mobiles/[brand]/[phone]/page.tsx
// Route: /mobiles/samsung/samsung-galaxy-s26-ultra, /mobiles/vivo/vivo-x300-pro, etc.

import { notFound } from "next/navigation";
import { phones } from "@/data/siteData";
import { slugify } from "@/lib/specGenerator";
import PhoneDetailPage from "@/components/PhoneDetailPage";

export function generateStaticParams() {
  return phones.map((p) => ({ brand: p.brand, phone: slugify(p.name) }));
}

export default function Page({ params }: { params: { brand: string; phone: string } }) {
  const phone = phones.find(
    (p) => p.brand.toLowerCase() === params.brand.toLowerCase() && slugify(p.name) === params.phone
  );

  if (!phone) notFound();

  return <PhoneDetailPage phone={phone} />;
}
