import Image from "next/image";
import Link from "next/link";
import type { Phone } from "@/data/siteData";
import { slugify } from "@/lib/specGenerator";
import {
  Cpu,
  MemoryStick,
  Camera,
  Smartphone,
  BatteryCharging,
  MonitorSmartphone,
  TrendingUp,
  UserRound,
  PenSquare,
  MoreVertical,
} from "lucide-react";

export default function PhoneCard({ phone }: { phone: Phone }) {
  const detailHref = `/mobiles/${phone.brand}/${slugify(phone.name)}`;

  return (
    <div className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white p-6 mb-6">
      <div className="flex items-center justify-between mb-1">
        <Link href={detailHref} className="text-lg font-bold text-gray-900 hover:underline underline decoration-2">
          {phone.name}
        </Link>
        <a href="#" className="text-sm font-semibold text-orange-500 hover:text-orange-600 whitespace-nowrap">
          + Compare
        </a>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        Release Date: <span className="font-semibold text-gray-700">{phone.releaseDate}</span>
      </p>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <div className="relative shrink-0 mx-auto sm:mx-0">
          <span className="absolute -top-1 -left-1 z-10 bg-green-600 text-white text-[10px] font-bold rounded-md w-12 h-12 flex flex-col items-center justify-center leading-tight">
            {phone.specScore}%<span className="font-normal">Spec</span>
          </span>
          <Link href={detailHref} className="relative w-[150px] h-[190px] bg-gray-50 rounded-lg overflow-hidden block">
            <Image src={phone.image} alt={phone.name} fill className="object-cover" />
          </Link>
          <p className="text-center mt-2">
            <a href="#" className="text-xs font-semibold text-gray-900 underline">
             
            </a>
          </p>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="space-y-2.5 text-sm text-gray-700 flex-1">
              <p className="flex items-center gap-2.5">
                <Cpu className="w-4 h-4 text-gray-400 shrink-0" /> {phone.chipset}
              </p>
              <p className="flex items-center gap-2.5">
                <MemoryStick className="w-4 h-4 text-gray-400 shrink-0" /> {phone.ram} GB RAM | {phone.storage} GB Storage
              </p>
              <p className="flex items-center gap-2.5">
                <Camera className="w-4 h-4 text-gray-400 shrink-0" /> {phone.rearCamera}
              </p>
              <p className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-gray-400 shrink-0" /> {phone.frontCamera}
              </p>
              <p className="flex items-center gap-2.5">
                <BatteryCharging className="w-4 h-4 text-gray-400 shrink-0" /> {phone.battery} mAh | {phone.charging}
              </p>
              <p className="flex items-center gap-2.5">
                <MonitorSmartphone className="w-4 h-4 text-gray-400 shrink-0" /> {phone.displaySize} | {phone.displayType}
              </p>
              <div className="flex items-center justify-between pt-1">
                <p className="flex items-center gap-2.5 text-gray-500">
                  <TrendingUp className="w-4 h-4 text-gray-400 shrink-0" />
                  AnTuTu Score {phone.antutu > 0 ? phone.antutu.toLocaleString("en-IN") : "—"}
                </p>
                <Link href={detailHref} className="hidden sm:inline text-sm font-semibold text-gray-900 underline whitespace-nowrap">
                  View All Specs
                </Link>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600 shrink-0 ml-2">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2.5 bg-white">
            <span className="text-lg">🏅</span>
            <span className="text-sm font-semibold text-gray-700">Awards:</span>
            <a href="#" className="text-sm font-semibold text-gray-900 underline flex items-center gap-1">
              Best {phone.os === "iOS" ? "Mobile" : "Android"} Phones ›
            </a>
          </div>

          <div className="mt-4 flex items-center gap-8">
            <div className="flex items-center gap-2">
              <UserRound className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">User Rating</span>
              <span className="text-yellow-500">★</span>
              <span className="font-bold text-gray-900">{phone.userRating}/5</span>
              <span className="text-gray-400 text-sm">({phone.userRatingCount.toLocaleString("en-IN")} Ratings)</span>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PenSquare className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">Expert Rating</span>
              <span className="text-yellow-500">★</span>
              <span className="font-bold text-gray-900">{phone.expertRating}/10</span>
            </div>
            <a href="#" className="text-sm font-semibold text-gray-900 underline whitespace-nowrap">
              Read Full Review
            </a>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
        <span className="text-sm font-semibold text-gray-700">{phone.store}</span>
        <span className="font-bold text-gray-900 text-lg">₹{phone.price.toLocaleString("en-IN")}</span>
        <a href="#" className="text-orange-500 font-semibold text-sm hover:text-orange-600 whitespace-nowrap">
          Go To Store
        </a>
      </div>
    </div>
  );
}
