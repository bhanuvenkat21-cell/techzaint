// components/FeaturedNews.tsx
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { featuredNews } from "@/data/siteData";

const categoryStyles: Record<string, string> = {
  Review: "bg-red-50 text-red-500",
  News: "bg-blue-50 text-blue-500",
  Comparison: "bg-green-50 text-green-600",
};

export default function FeaturedNews() {
  return (
    <section className="w-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            News &amp; Reviews
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            In-depth editorial coverage from our experts
          </p>
        </div>
        <Link
          href="#"
          className="flex items-center gap-1 text-sm font-semibold text-red-500 hover:underline whitespace-nowrap"
        >
          All articles <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {featuredNews.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
          >
           <Link href={item.href} className="block p-3 pb-0">
  <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-gray-100">
    <Image
      src={item.image}
      alt={item.title}
      fill
      sizes="(max-width: 768px) 100vw, 33vw"
      className="object-cover group-hover:scale-105 transition-transform duration-300"
    />
  </div>
</Link>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    categoryStyles[item.category] ?? "bg-gray-50 text-gray-500"
                  }`}
                >
                  {item.category}
                </span>
                <span className="text-xs text-gray-400">{item.date}</span>
              </div>

              <Link href={item.href}>
                <h3 className="text-sm md:text-base font-bold text-gray-900 leading-snug hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
              </Link>

              <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">
                {item.description}
              </p>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  {item.readTime}
                </div>
                <Link
                  href={item.href}
                  className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:underline"
                >
                  Read more <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}