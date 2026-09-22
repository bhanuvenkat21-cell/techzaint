"use client";

const demoAds = {
  left: {
    brand: "Samsung",
    headline: "Galaxy Z Fold 8",
    subtext: "Pre-order now & get Galaxy Buds free",
    cta: "Buy Now",
    gradient: "from-blue-700 to-sky-500",
  },
  right: {
    brand: "Apple",
    headline: "iPhone 17 Pro",
    subtext: "Trade in your old phone & save more",
    cta: "Shop Now",
    gradient: "from-gray-900 to-gray-600",
  },
}; 
export default function SideBanner({
  side,
}: {
  side: "left" | "right";
}) {
  const ad = demoAds[side];

  return (
    <div
      className={`hidden xl:flex fixed top-32 ${
        side === "left" ? "left-4" : "right-4"
      } w-[160px] h-[600px] z-10`}
    >
      <a
        href="#"
        className={`w-full h-full rounded-xl overflow-hidden shadow-lg bg-gradient-to-b ${ad.gradient} flex flex-col items-center justify-between text-white p-4 text-center hover:opacity-95 transition-opacity`}
      >
        <span className="text-[9px] uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">
          Advertisement
        </span>

        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center text-2xl font-bold">
            {ad.brand.charAt(0)}
          </div>

          <div>
            <p className="text-sm font-bold leading-tight">
              {ad.headline}
            </p>

            <p className="text-xs text-white/80 mt-1 leading-tight">
              {ad.subtext}
            </p>
          </div>
        </div>

        <span className="bg-white text-gray-900 text-xs font-bold px-4 py-2 rounded-full">
          {ad.cta}
        </span>
      </a>
    </div>
  );
}