// components/TopBar.tsx
import Link from "next/link";
import { latestMobiles } from "@/data/siteData";

export default function TopBar() {
  return (
    <div className="hidden md:block bg-[#101820] text-white text-xs">
      <div className="max-w-container mx-auto px-4 lg:px-6 h-10 flex items-center justify-between gap-6">
        <p className="text-gray-300 whitespace-nowrap">
          Largest Gadget Discovery Site in India
        </p>

        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-blue-400 font-medium whitespace-nowrap">
            Latest Mobiles :
          </span>
          <div className="flex items-center gap-2 whitespace-nowrap">
            {latestMobiles.map((m, i) => (
              <span key={m} className="flex items-center gap-2">
                <Link href="#" className="text-gray-200 hover:text-white">
                  {m}
                </Link>
                {i < latestMobiles.length - 1 && (
                  <span className="text-gray-600">|</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>  
  );
}
