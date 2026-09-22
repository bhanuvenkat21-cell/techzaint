import MobileFinder from "@/components/MobileFinder";
import FeaturedBrands from "@/components/FeaturedBrands";
import FeaturedLaptopBrands from "@/components/FeaturedLaptopBrands";
import NewsHeroWidget from "@/components/NewsHeroWidget";
import BestOfSection from "@/components/BestOfSection";
import UpcomingMobiles from "@/components/UpcomingMobiles";
import FeaturedComparisons from "@/components/FeaturedComparisons";
import FeaturedNews from "@/components/FeaturedNews";
import BuyCategories from "@/components/BuyCategories";
import {
  bestMobilesCategories,
  bestMobilesPrices,
  bestLaptopsCategories,
  bestLaptopsPrices,
} from "@/data/siteData";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">
      <NewsHeroWidget />
      <FeaturedBrands />
      <FeaturedLaptopBrands />
      <MobileFinder />
      <BuyCategories />
      <BestOfSection
        title="Best Mobiles"
        categories={bestMobilesCategories}
        prices={bestMobilesPrices}
      />
      <BestOfSection
        title="Best Laptops"
        categories={bestLaptopsCategories}
        prices={bestLaptopsPrices}
      />
      <UpcomingMobiles />
      <FeaturedComparisons />
      <FeaturedNews />
    </main>
  );
}