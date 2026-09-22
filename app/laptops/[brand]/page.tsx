// app/laptops/[brand]/page.tsx
// Route: /laptops/hp, /laptops/dell, /laptops/acer, /laptops/apple,
//        /laptops/lenovo, /laptops/asus, /laptops/msi, /laptops/samsung

import { notFound } from "next/navigation";
import Image from "next/image";
import { featuredLaptopBrands, getLaptopsByBrand } from "@/data/laptopData";

export function generateStaticParams() {
  return featuredLaptopBrands.map((b) => ({ brand: b.slug }));
}

export default function LaptopBrandPage({ params }: { params: { brand: string } }) {
  const brand = featuredLaptopBrands.find(
    (b) => b.slug.toLowerCase() === params.brand.toLowerCase()
  );
  if (!brand) return notFound();

  const brandLaptops = getLaptopsByBrand(brand.slug);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{brand.name} Laptops</h1>

      {brandLaptops.length === 0 ? (
        <p className="text-gray-500">No {brand.name} laptops available yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {brandLaptops.map((laptop) => (
            <div
              key={laptop.id}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white"
            >
              <div className="relative w-full aspect-[4/3] mb-3">
                <Image
                  src={laptop.image}
                  alt={laptop.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{laptop.name}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {laptop.processor} · {laptop.ram}GB / {laptop.storage}GB {laptop.storageType}
              </p>
              <p className="text-xs text-gray-500">
                {laptop.displaySize}" {laptop.displayType}
              </p>
              <p className="text-orange-600 font-bold mt-2">
                ₹{laptop.price.toLocaleString("en-IN")}
              </p>
              {laptop.isGaming && (
                <span className="inline-block mt-2 text-[10px] font-semibold text-white bg-green-600 px-2 py-0.5 rounded">
                  GAMING
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
