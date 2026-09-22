"use client";

import { useState } from "react";
import type { Phone } from "@/data/siteData";

export default function PhoneFinderTable({ phones }: { phones: Phone[] }) {
  const [expanded, setExpanded] = useState(false);

  const sorted = [...phones].sort((a, b) => b.specScore - a.specScore);
  const visible = expanded ? sorted : sorted.slice(0, 3);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Phone Finder</h1>
      <p className="text-sm text-gray-500 mb-1">
        Confused with which Phone to buy? Just feed in your requirements to our Phone Finder
        and you will get the best recommended Phones in India with price.
      </p>
      <p className="text-sm text-gray-500 mb-5">Start your search now.</p>

      <h2 className="text-base font-bold text-gray-900 mb-3">
        Top {expanded ? sorted.length : 5} Phones with Prices &amp; Specs
      </h2>

      <p className="text-xs text-gray-400 mb-2 sm:hidden">← Swipe to see more →</p>

      <div className="border border-gray-300 rounded-lg overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-900 font-semibold">
              <th className="px-3 py-3 border border-gray-300">Product</th>
              <th className="px-3 py-3 border border-gray-300">RAM/Storage</th>
              <th className="px-3 py-3 border border-gray-300">Camera</th>
              <th className="px-3 py-3 border border-gray-300">Battery</th>
              <th className="px-3 py-3 border border-gray-300">AnTuTu</th>
              <th className="px-3 py-3 border border-gray-300">Score</th>
              <th className="px-3 py-3 border border-gray-300 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((p, i) => (
              <tr key={p.id} className={i % 2 === 1 ? "bg-gray-50" : "bg-white"}>
                <td className="px-3 py-3 align-top border border-gray-300">
                  <div className="font-medium text-gray-900 leading-tight">{p.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{p.chipset}</div>
                </td>
                <td className="px-3 py-3 align-top border border-gray-300 text-gray-700 whitespace-nowrap">
                  {p.ram} GB / {p.storage} GB
                </td>
                <td className="px-3 py-3 align-top border border-gray-300 text-gray-700 whitespace-nowrap">
                  {p.rearCameraMP} MP
                </td>
                <td className="px-3 py-3 align-top border border-gray-300 text-gray-700 whitespace-nowrap">
                  {p.battery} mAh
                </td>
                <td className="px-3 py-3 align-top border border-gray-300 text-gray-700 whitespace-nowrap">
                  {p.antutu > 0 ? p.antutu.toLocaleString("en-US") : "—"}
                </td>
                <td className="px-3 py-3 align-top border border-gray-300 text-gray-700">
                  {p.specScore}%
                </td>
                <td className="px-3 py-3 align-top border border-gray-300 text-right font-semibold text-gray-900 whitespace-nowrap">
                  ₹{p.price.toLocaleString("en-US")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-4 text-orange-500 font-medium text-sm hover:text-orange-600"
      >
        {expanded ? "read less" : "read more"}
      </button>
    </div>
  );
}