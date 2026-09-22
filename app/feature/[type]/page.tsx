// app/feature/[type]/page.tsx
// Route: /feature/5g, /feature/camera, /feature/gaming, /feature/keypad
// Matches the "Feature" column hrefs already defined in siteData.ts megaMenus.

import { notFound } from "next/navigation";
import { phones, type Phone } from "@/data/siteData";
import BrandPhoneListing from "@/components/BrandPhoneListing";
import PhoneFinderTable from "@/components/PhoneFinderTable";

type FeatureConfig = {
  label: string;
  filter: (p: Phone) => boolean;
  sort?: (a: Phone, b: Phone) => number;
};

const featureConfig: Record<string, FeatureConfig> = {
  "5g": {
    label: "5G Mobiles",
    filter: (p) => p.is5G,
  },
  camera: {
    label: "Best Camera Phones",
    filter: (p) => p.rearCameraMP >= 50,
    sort: (a, b) => b.rearCameraMP - a.rearCameraMP,
  },
  gaming: {
    label: "Best Gaming Phones",
    filter: (p) => p.antutu >= 800000,
    sort: (a, b) => b.antutu - a.antutu,
  },
  keypad: {
    label: "Keypad Mobiles",
    // Your current dataset only contains touchscreen smartphones, so this
    // will legitimately return zero results until keypad phones are added
    // to `phones` in siteData.ts with a way to identify them (e.g. a
    // `formFactor: "keypad"` field).
    filter: (p) => p.displayType?.toLowerCase().includes("keypad") ?? false,
  },
};

export default function FeaturePage({ params }: { params: { type: string } }) {
  const config = featureConfig[params.type.toLowerCase()];
  if (!config) return notFound();

  let filteredPhones = phones.filter(config.filter);
  if (config.sort) filteredPhones = [...filteredPhones].sort(config.sort);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
      <PhoneFinderTable phones={filteredPhones} />
      <BrandPhoneListing brandName={config.label} phones={filteredPhones} />
    </div>
  );
}
