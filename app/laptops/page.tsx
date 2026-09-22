// app/laptops/page.tsx
// Route: /laptops

import Link from "next/link";
import Image from "next/image";
import { laptops } from "@/data/laptopData";
import FeaturedLaptopBrands from "@/components/FeaturedLaptopBrands";

export default function LaptopsPage() {
  return (
    <div>
      <FeaturedLaptopBrands />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">All Laptops</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {laptops.map((laptop) => (
            <Link
              key={laptop.id}
              href={`/laptops/${laptop.brand}`}
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
                {laptop.processor} · {laptop.ram}GB RAM
              </p>
              <p className="text-orange-600 font-bold mt-2">
                ₹{laptop.price.toLocaleString("en-IN")}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
