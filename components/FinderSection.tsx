// components/FinderSection.tsx
import MobileFinder from "./MobileFinder";
import BuyCategories from "./BuyCategories";
import PriceChips from "./PriceChips";
import { mobilesByPrice } from "@/data/siteData";

export default function FinderSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5 items-start">
      <MobileFinder />
      <div className="flex flex-col gap-5">
  <PriceChips title="Mobiles by Price" prices={mobilesByPrice} />
  <BuyCategories />
</div>
    </div>
  );
}
