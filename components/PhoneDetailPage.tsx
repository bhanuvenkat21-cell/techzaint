  "use client";

  import React, { useMemo, useRef, useState, useEffect } from "react";
  import Link from "next/link";
  import { motion, AnimatePresence } from "framer-motion";
  import {
    Star, ShoppingCart, Heart, Share2, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
    X, Bell, TrendingDown, BarChart3, Cpu, Battery, Camera, Smartphone, Wifi, Monitor,
    Speaker, Shield, Layers, Award, Check, Minus, Plus, Maximize2, RotateCcw, Info, Zap,
    Gamepad2, Eye, GitCompare, Trophy,
  } from "lucide-react";

  import type { Phone } from "@/data/siteData";
  import { generateSpecs, getTier, slugify } from "@/lib/specGenerator";
  import { phones } from "@/data/siteData";

  const fmt = (n: number) => n.toLocaleString("en-IN");

  // ─── Score helpers (drive the "Excellent / Best In Class" bars) ───────

  function scoreLabel(score: number) {
    if (score >= 95) return "Best In Class";
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Very Good";
    if (score >= 55) return "Good";
    return "Average";
  }

  function buildCategoryScores(phone: Phone) {
    const perf = Math.min(100, Math.round((phone.antutu / 2700000) * 100)) || phone.specScore;
    const display = Math.min(
      100,
      Math.round((phone.refreshRate >= 120 ? 88 : 72) + (phone.displaySizeInches > 6.5 ? 5 : 0))
    );
    const rearCam = Math.min(100, Math.round(60 + phone.rearCameraMP / 3));
    const frontCam = Math.min(100, Math.round(70 + (parseInt(phone.frontCamera.match(/(\d+)/)?.[1] ?? "12", 10) / 2)));
    const battery = Math.min(100, Math.round((phone.battery / 6000) * 100));
    return {
      performance: { score: perf, label: scoreLabel(perf) },
      display: { score: display, label: scoreLabel(display) },
      rearCamera: { score: rearCam, label: scoreLabel(rearCam) },
      frontCamera: { score: frontCam, label: scoreLabel(frontCam) },
      battery: { score: battery, label: scoreLabel(battery) },
    };
  }

  // ─── Reusable bits ──────────────────────────────────────────────

  const StarRating = ({ rating, size = 16 }: { rating: number; size?: number }) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : star <= rating
              ? "fill-amber-400/50 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }
        />
      ))}
    </div>
  );

 const InlineScoreBar = ({ icon, title, score, label }: { icon: React.ReactNode; title: string; score: number; label: string }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
    <div className="flex items-center gap-2.5 text-gray-900 font-semibold text-sm">
      <span className="text-gray-500">{icon}</span>
      {title}
    </div>
    <div className="flex items-center gap-2">
      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
        <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-emerald-600" />
      </div>
      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full whitespace-nowrap">{label}</span>
    </div>
  </div>
);
  // Short horizontal score bar with a text label to the right — matches the
  // "Performance ▬▬▬▬▬▬▬▬ (Excellent)" rows in the reference screenshots.
 const SpecRow = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-3 py-1.5">
    <span className="text-gray-500 shrink-0">{icon}</span>
    <span className="text-sm text-gray-800">{text}</span>
  </div>
);

  const ScoreRing = ({ score, label, size = 80 }: { score: number; label: string; size?: number }) => {
    const circumference = 2 * Math.PI * ((size - 8) / 2);
    const strokeDashoffset = circumference - (score / 100) * circumference;
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            <circle cx={size / 2} cy={size / 2} r={(size - 8) / 2} stroke="#E5E7EB" strokeWidth="6" fill="none" />
            <motion.circle
              cx={size / 2} cy={size / 2} r={(size - 8) / 2}
              stroke={score >= 90 ? "#10B981" : score >= 75 ? "#F59E0B" : "#EF4444"}
              strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset }} transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-gray-900">{score}</span>
          </div>
        </div>
        <span className="text-xs font-medium text-gray-600 text-center">{label}</span>
      </div>
    );
  };

  // ─── Derived-data builders ──────────────────────────────────────

  function buildProductData(phone: Phone) {
    const tier = getTier(phone.price);
    const awards: string[] = [];
    if (phone.expertRating >= 8.5) awards.push("Editor's Choice");
    if (phone.userRating >= 4.6) awards.push("User Favorite");
    if (phone.antutu > 2000000) awards.push("Performance Pick");
    if (phone.rearCameraMP >= 100) awards.push("Camera Standout");
    if (awards.length === 0) awards.push("Best Value");

    return {
      name: phone.name,
      launchDate: phone.releaseDate,
      userRating: phone.userRating,
      userRatingCount: phone.userRatingCount,
      expertRating: phone.expertRating,
      techInfoScore: phone.specScore,
      awards,
      keySpecs: [
        { label: "Display", value: phone.displaySize },
        { label: "Processor", value: phone.chipset },
        { label: "RAM", value: `${phone.ram}GB` },
        { label: "Storage", value: `${phone.storage}GB` },
        { label: "Battery", value: `${phone.battery}mAh` },
        { label: "Charging", value: phone.charging },
        { label: "Main Camera", value: phone.rearCamera },
        { label: "OS", value: phone.os },
      ],
      price: phone.price,
      colors: [
        { name: "Midnight Black", hex: "#1A202C" },
        { name: "Frost Silver", hex: "#CBD5E0" },
        { name: "Ocean Blue", hex: "#3B5C8C" },
      ],
      storageVariants: Array.from(new Set(phones.filter((p) => p.brand === phone.brand && p.chipset === phone.chipset).map((p) => p.storage))).sort((a, b) => a - b),
      images: [phone.image, phone.image, phone.image, phone.image],
      tier,
    };
  }

  function buildPriceData(phone: Phone, storage: number) {
    const priceForStorage = phone.storage === storage ? phone.price : Math.round((phone.price * (storage / phone.storage)) / 100) * 100;
    const stores = [
      { store: "Flipkart", logo: "FK", color: "#2874F0" },
      { store: "Amazon", logo: "AZ", color: "#FF9900" },
      { store: "Croma", logo: "CR", color: "#00A8E1" },
      { store: "Reliance Digital", logo: "RD", color: "#E31837" },
      { store: "Vijay Sales", logo: "VS", color: "#F26522" },
    ];
    const offers = ["10% off on ICICI Cards", "No Cost EMI", "Exchange Offer up to ₹15,000", "5% Cashback", "Free Screen Protector"];
    const deliveries = ["Tomorrow", "2 Days", "3-5 Days", "2-3 Days", "Same Day"];

    return stores.map((s, i) => {
      const jitter = (i - 2) * (priceForStorage * 0.008);
      const price = Math.round((priceForStorage + jitter) / 100) * 100;
      return {
        ...s,
        price: s.store === phone.store && storage === phone.storage ? phone.price : price,
        originalPrice: Math.round(priceForStorage * 1.06),
        availability: i === 3 ? "Limited Stock" : "In Stock",
        offers: offers[i],
        delivery: deliveries[i],
      };
    });
  }

  function buildPriceHistory(phone: Phone) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
    return months.map((month, i) => {
      const dropFactor = 1 + (months.length - 1 - i) * 0.012;
      return { month, price: Math.round((phone.price * dropFactor) / 100) * 100 };
    });
  }

  function buildCompetitors(phone: Phone) {
    return phones
      .filter((p) => p.id !== phone.id && Math.abs(p.price - phone.price) < phone.price * 0.25)
      .sort((a, b) => Math.abs(a.price - phone.price) - Math.abs(b.price - phone.price))
      .slice(0, 4)
      .map((p) => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        image: p.image,
        price: p.price,
        display: p.displaySize,
        chipset: p.chipset,
        rearCamera: p.rearCamera,
        frontCameraMP: parseInt(p.frontCamera.match(/(\d+)/)?.[1] ?? "0", 10),
        battery: p.battery,
        performanceScore: Math.min(99, Math.round((p.antutu / 2700000) * 100)),
        cameraScore: Math.min(99, Math.round(60 + p.rearCameraMP / 4)),
        batteryScore: Math.min(99, Math.round((p.battery / 6000) * 100)),
        overallScore: p.specScore,
      }));
  }

  function buildSimilarPhones(phone: Phone) {
    return phones
      .filter((p) => p.id !== phone.id)
      .sort((a, b) => Math.abs(a.price - phone.price) - Math.abs(b.price - phone.price))
      .slice(0, 10);
  }

  function buildBenchmarkData(phone: Phone) {
    const perf = Math.min(100, Math.round((phone.antutu / 2700000) * 100));
    const cpuScore = Math.round(phone.antutu * 0.354);
    const gpuScore = Math.round(phone.antutu * 0.35);
    const memScore = Math.round(phone.antutu * 0.13);
    const uxScore = Math.round(phone.antutu * 0.167);
    return {
      antutu: { score: phone.antutu, max: 4200000, label: "AnTuTu v10" },
      geekSingle: Math.round(1200 + perf * 24),
      geekMulti: Math.round(3200 + perf * 61),
      cpu: { score: cpuScore, max: 1200000, label: "CPU Performance", percentile: Math.min(99, perf + 1) },
      gpu: { score: gpuScore, max: 1200000, label: "GPU Performance", percentile: Math.max(perf - 3, 0) },
      memory: { score: memScore, max: 400000, label: "Memory", percentile: Math.max(perf - 8, 0) },
      ux: { score: uxScore, max: 500000, label: "UX", percentile: Math.max(perf - 2, 0) },
      wildLifeExtreme: Math.round(1500 + perf * 33),
      steelNomad: Math.round(700 + perf * 15),
      bootupTime: Math.max(9, Math.round(26 - perf / 5)),
      batteryDrainPct: Math.max(3, Math.round(11 - perf / 10)),
      heatingPct: Math.max(3, Math.round(perf / 9)),
    };
  }

  // ─── Sidebar (persists across every tab, matches reference) ────────────

  function ProductSummaryCard({ phone }: { phone: Phone }) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-3">{phone.name}</h3>
        <div className="w-full h-32 bg-gray-50 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
          <img src={phone.image} alt={phone.name} className="max-h-full object-contain" />
        </div>
        <p className="text-2xl font-bold text-gray-900 mb-1">₹{fmt(phone.price)}</p>
        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded mb-3">
          {phone.store}
        </div>
        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg py-3 transition-colors">
          Go To Store
        </button>
      </div>
    );
  }

  function SimilarPhonesSidebar({ phone }: { phone: Phone }) {
    const similar = useMemo(() => buildSimilarPhones(phone), [phone]);
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-base font-bold text-gray-900 mb-3">Similar Phones</h3>
        <div className="divide-y divide-gray-100">
          {similar.map((p) => (
            <Link
              key={p.id}
              href={`/mobiles/${p.brand}/${slugify(p.name)}`}
              className="flex items-center justify-between py-2.5 text-sm font-medium text-gray-800 hover:text-orange-600 transition-colors"
            >
              {p.name}
              <ChevronRight size={16} className="text-gray-300" />
            </Link>
          ))}
        </div>
      </div>
    );
  }

  function RightSidebar({ phone }: { phone: Phone }) {
    return (
      <aside className="hidden lg:block w-[300px] shrink-0 space-y-5 sticky top-24 self-start">
        <ProductSummaryCard phone={phone} />
        <SimilarPhonesSidebar phone={phone} />
      </aside>
    );
  }

  // ─── Main component ─────────────────────────────────────────────

  export default function PhoneDetailPage({ phone }: { phone: Phone }) {
    const [activeTab, setActiveTab] = useState("info");
    const [isSticky, setIsSticky] = useState(false);
    const tabRef = useRef<HTMLDivElement>(null);

    const productData = useMemo(() => buildProductData(phone), [phone]);
    const categoryScores = useMemo(() => buildCategoryScores(phone), [phone]);
    const priceHistory = useMemo(() => buildPriceHistory(phone), [phone]);
    const specsData = useMemo(() => generateSpecs(phone), [phone]);
    const competitorsData = useMemo(() => buildCompetitors(phone), [phone]);
    const benchmarkData = useMemo(() => buildBenchmarkData(phone), [phone]);

    useEffect(() => {
      const handleScroll = () => {
        if (tabRef.current) setIsSticky(tabRef.current.getBoundingClientRect().top <= 0);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const tabs = [
      { id: "info", label: "INFO", icon: <Info size={16} /> },
      { id: "prices", label: "PRICES", icon: <ShoppingCart size={16} /> },
      { id: "specs", label: "SPECS", icon: <Layers size={16} /> },
      { id: "photos", label: "PHOTOS", icon: <Camera size={16} /> },
      { id: "competitors", label: "COMPETITORS", icon: <GitCompare size={16} /> },
      { id: "benchmarks", label: "BENCHMARKS", icon: <BarChart3 size={16} /> },
    ];

    return (
      <div className="min-h-screen bg-gray-50">
        <div ref={tabRef} className={`bg-white border-b border-gray-200 transition-shadow duration-300 ${isSticky ? "sticky top-16 z-30 shadow-sm" : ""}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-4 text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === tab.id ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                >
                  {tab.icon}
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  {activeTab === "info" && <InfoTab phone={phone} productData={productData} categoryScores={categoryScores} />}
                  {activeTab === "prices" && <PricesTab phone={phone} productData={productData} priceHistory={priceHistory} competitorsData={competitorsData} />}
                  {activeTab === "specs" && <SpecsTab specsData={specsData} />}
                  {activeTab === "photos" && <PhotosTab phone={phone} />}
                  {activeTab === "competitors" && <CompetitorsTab competitorsData={competitorsData} />}
                  {activeTab === "benchmarks" && <BenchmarksTab benchmarkData={benchmarkData} phone={phone} />}
                </motion.div>
              </AnimatePresence>
            </div>
            <RightSidebar phone={phone} />
          </div>
        </main>
      </div>
    );
  }

  // ─── Tabs ────────────────────────────────────────────────────────
  function InfoTab({
    phone, productData, categoryScores,
  }: {
    phone: Phone;
    productData: ReturnType<typeof buildProductData>;
    categoryScores: ReturnType<typeof buildCategoryScores>;
  }) {
    return (
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold text-gray-900 underline decoration-2 underline-offset-4">
            {productData.name}
          </h1>
          <button className="flex items-center gap-1.5 text-orange-600 font-semibold text-sm shrink-0">
            <Plus size={14} /> Compare
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded">New</span>
          <span className="text-sm text-gray-500">
            Release Date: <strong className="text-gray-800">{productData.launchDate}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Image column */}
          <div className="space-y-2">
            <div className="relative bg-white rounded-xl border border-gray-100 overflow-hidden aspect-square w-full max-w-[280px]">
              <span className="absolute top-2 left-2 z-10 bg-emerald-600 text-white text-xs font-bold px-2 py-1.5 rounded text-center leading-tight">
                {productData.techInfoScore}%<br />Spec Score
              </span>
              <img
                src={productData.images[0]}
                alt={productData.name}
                className="absolute inset-0 w-full h-full object-contain p-6"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50">
                <RotateCcw size={16} className="text-gray-500" />
              </button>
              <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50">
                <Camera size={16} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Specs column */}
          <div className="space-y-1">
            <SpecRow icon={<Cpu size={16} />} text={phone.chipset} />
            <SpecRow icon={<Layers size={16} />} text={`${phone.ram} GB RAM | ${phone.storage} GB Storage`} />
            <SpecRow icon={<Camera size={16} />} text={`${phone.rearCamera} Rear Camera`} />
            <SpecRow icon={<Smartphone size={16} />} text={`${phone.frontCamera} Front Camera`} />
            <SpecRow icon={<Battery size={16} />} text={`${fmt(phone.battery)} mAh | ${phone.charging}`} />
            <SpecRow icon={<Monitor size={16} />} text={phone.displaySize} />
            <SpecRow icon={<BarChart3 size={16} />} text={`AnTuTu Score ${fmt(phone.antutu)}`} />

            <div className="flex items-center gap-6 pt-3">
              <button className="text-sm font-semibold text-gray-900 underline">
                View Photos ({productData.images.length})
              </button>
              <button className="text-sm font-semibold text-gray-900 underline">View All Specs</button>
            </div>

            <div className="border border-gray-200 rounded-lg px-4 py-3 flex items-center gap-2 mt-3">
              <Award size={16} className="text-amber-500 shrink-0" />
              <span className="text-sm font-semibold text-gray-800 shrink-0">Awards:</span>
              <span className="text-sm font-medium text-gray-700 underline truncate">{productData.awards[0]}</span>
              <ChevronRight size={14} className="text-gray-400 ml-auto shrink-0" />
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Info size={14} className="shrink-0" />
                Expert Rating
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star size={14} className="fill-amber-400" /> {productData.expertRating}/10
                </span>
              </div>
              <button className="text-sm font-semibold underline text-gray-900">Read Full Review</button>
            </div>

            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 mt-3">
              <span className="text-sm font-semibold text-gray-800">{phone.store}</span>
              <span className="text-base font-bold text-gray-900">₹{fmt(productData.price)}</span>
              <button className="text-orange-600 font-semibold text-sm">Go To Store</button>
            </div>
          </div>
        </div>

        {/* Additional detail retained below the reference-matched hero */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-bold text-gray-900 border-l-4 border-orange-500 pl-3 mb-4">Key Specs</h3>
          <InlineScoreBar icon={<Cpu size={16} />} title="Performance" score={categoryScores.performance.score} label={categoryScores.performance.label} />
          <InlineScoreBar icon={<Monitor size={16} />} title="Display" score={categoryScores.display.score} label={categoryScores.display.label} />
          <InlineScoreBar icon={<Camera size={16} />} title="Rear Camera" score={categoryScores.rearCamera.score} label={categoryScores.rearCamera.label} />
          <InlineScoreBar icon={<Camera size={16} />} title="Front Camera" score={categoryScores.frontCamera.score} label={categoryScores.frontCamera.label} />
          <InlineScoreBar icon={<Battery size={16} />} title="Battery" score={categoryScores.battery.score} label={categoryScores.battery.label} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-bold text-gray-900 mb-4">General</h3>
          <div className="grid grid-cols-2 gap-3">
            {productData.keySpecs.map((spec, idx) => (
              <div key={idx}>
                <p className="text-xs text-gray-500 mb-0.5">{spec.label}</p>
                <p className="text-sm font-semibold text-gray-900">{spec.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }


  function PricesTab({
    phone, productData, priceHistory, competitorsData,
  }: {
    phone: Phone;
    productData: ReturnType<typeof buildProductData>;
    priceHistory: ReturnType<typeof buildPriceHistory>;
    competitorsData: ReturnType<typeof buildCompetitors>;
  }) {
    const variants = productData.storageVariants.length ? productData.storageVariants : [phone.storage];
    const [storage, setStorage] = useState(phone.storage);
    const priceData = useMemo(() => buildPriceData(phone, storage), [phone, storage]);
    const lowestPrice = Math.min(...priceData.map((p) => p.price));
    const [email, setEmail] = useState("");
    const [alertSet, setAlertSet] = useState(false);

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">{phone.name} Price In India</h2>
          <h3 className="text-base font-bold text-gray-900 mb-3">New Phone Prices</h3>
          <div className="flex flex-wrap gap-3 mb-4">
            {variants.map((v) => (
              <button
                key={v}
                onClick={() => setStorage(v)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${storage === v ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                {phone.ram} GB + {v} GB
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Store</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Availability</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Offers</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Delivery</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {priceData.map((store, idx) => (
                    <motion.tr key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className={`hover:bg-gray-50/50 transition-colors ${store.price === lowestPrice ? "bg-emerald-50/30" : ""}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: store.color }}>{store.logo}</div>
                          <div>
                            <p className="font-semibold text-gray-900">{store.store}</p>
                            {store.price === lowestPrice && <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600"><TrendingDown size={12} />Lowest Price</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-gray-900">₹{fmt(store.price)}</span>
                          <span className="text-xs text-gray-400 line-through">₹{fmt(store.originalPrice)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${store.availability === "In Stock" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          <Check size={12} />{store.availability}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{store.offers}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{store.delivery}</td>
                      <td className="px-6 py-4"><button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors">Go To Store</button></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-gray-900 mb-4">Best Competitors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {competitorsData.map((c, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-start justify-between mb-3">
                  <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded">{c.overallScore}% Spec Score</span>
                </div>
                <div className="flex gap-4">
                  <img src={c.image} alt={c.name} className="w-16 h-20 object-cover rounded-lg bg-gray-50 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-gray-900">{c.name}</h4>
                      <span className="font-bold text-gray-900">₹{fmt(c.price)}</span>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5"><Cpu size={12} />{c.chipset}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5"><Monitor size={12} />{c.display}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5"><Camera size={12} />{c.rearCamera}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5"><Battery size={12} />{fmt(c.battery)} mAh</p>
                  </div>
                </div>
                <button className="w-full mt-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-orange-500 hover:text-orange-600 transition-colors">
                  {phone.name} vs {c.name}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><TrendingDown size={18} className="text-orange-500" />Price History</h3>
            <div className="h-48 flex items-end gap-3">
              {priceHistory.map((item, idx) => {
                const maxPrice = Math.max(...priceHistory.map((p) => p.price));
                const minPrice = Math.min(...priceHistory.map((p) => p.price));
                const height = ((item.price - minPrice + 5000) / (maxPrice - minPrice + 5000)) * 100;
                const isLowest = item.price === minPrice;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ duration: 0.8, delay: idx * 0.1 }} className={`w-full rounded-t-lg ${isLowest ? "bg-orange-500" : "bg-gray-200"}`} />
                    <span className="text-xs font-medium text-gray-500">{item.month}</span>
                    <span className="text-xs font-bold text-gray-700">₹{(item.price / 1000).toFixed(0)}k</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/10 rounded-lg"><Bell size={20} className="text-orange-400" /></div>
              <div>
                <h3 className="text-lg font-bold">Price Drop Alert</h3>
                <p className="text-sm text-gray-400">Get notified when price drops</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:border-orange-500" />
                <button onClick={() => setAlertSet(true)} className="px-4 py-3 bg-orange-500 hover:bg-orange-600 rounded-xl font-medium text-sm transition-colors">{alertSet ? "Set!" : "Alert Me"}</button>
              </div>
              {alertSet && <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-emerald-400 flex items-center gap-1"><Check size={14} />Alert set successfully!</motion.p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function SpecsTab({ specsData }: { specsData: ReturnType<typeof generateSpecs> }) {
    const sections = Object.keys(specsData);
    const [active, setActive] = useState(sections[0] ?? "General");

    const sectionIcons: Record<string, React.ReactNode> = {
      General: <Info size={16} />, Display: <Monitor size={16} />, Performance: <Cpu size={16} />, Camera: <Camera size={16} />,
      Battery: <Battery size={16} />, Storage: <Layers size={16} />, Network: <Wifi size={16} />, Connectivity: <Smartphone size={16} />,
      Sensors: <Eye size={16} />, Design: <Smartphone size={16} />, Multimedia: <Speaker size={16} />, Security: <Shield size={16} />, Benchmarks: <BarChart3 size={16} />,
    };

    const specs = specsData[active] ?? [];

    return (
      <div className="space-y-5">
        <h2 className="text-xl font-bold text-gray-900">Full Specifications</h2>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => setActive(section)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${active === section ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              {sectionIcons[section]}{section}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="text-base font-bold text-gray-900 mb-2">{active}</h3>
          <div className="divide-y divide-gray-50">
            {specs.map((spec, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }} className={`flex justify-between items-center py-3.5 ${idx % 2 === 0 ? "bg-gray-50/50 -mx-5 px-5" : ""}`}>
                <span className="text-sm text-gray-500">{spec.label}</span>
                <span className="text-sm font-semibold text-gray-900 text-right ml-4">{spec.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function PhotosTab({ phone }: { phone: Phone }) {
    const photosData = [
      { id: 1, src: phone.image, alt: "Front View", category: "Front" },
      { id: 2, src: phone.image, alt: "Back View", category: "Back" },
      { id: 3, src: phone.image, alt: "Side View", category: "Side" },
      { id: 4, src: phone.image, alt: "Lifestyle", category: "Lifestyle" },
    ];
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
    const [zoom, setZoom] = useState(1);

    const openLightbox = (index: number) => { setCurrentImage(index); setLightboxOpen(true); setZoom(1); };
    const nextImage = () => setCurrentImage((prev) => (prev + 1) % photosData.length);
    const prevImage = () => setCurrentImage((prev) => (prev - 1 + photosData.length) % photosData.length);

    return (
      <div className="space-y-6">
        <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden flex items-center justify-center">
          <div className="text-center text-white">
            <RotateCcw size={48} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">360° View</h3>
            <p className="text-gray-400 text-sm">Interactive 360° viewer coming soon</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photosData.map((photo, idx) => (
            <motion.div key={photo.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-gray-100" onClick={() => openLightbox(idx)}>
              <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"><Maximize2 size={24} className="text-white" /></div>
              <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur rounded-lg text-white text-xs font-medium">{photo.category}</div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {lightboxOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
              <button className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors" onClick={() => setLightboxOpen(false)}><X size={28} /></button>
              <button className="absolute left-4 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors" onClick={(e) => { e.stopPropagation(); prevImage(); }}><ChevronLeft size={24} /></button>
              <motion.img key={currentImage} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} src={photosData[currentImage].src} alt={photosData[currentImage].alt} className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg" style={{ transform: `scale(${zoom})` }} onClick={(e) => e.stopPropagation()} />
              <button className="absolute right-4 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors" onClick={(e) => { e.stopPropagation(); nextImage(); }}><ChevronRight size={24} /></button>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
                <span className="text-white text-sm font-medium">{currentImage + 1} / {photosData.length}</span>
                <div className="flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.min(z + 0.5, 3)); }} className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20"><Plus size={18} /></button>
                  <button onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.max(z - 0.5, 1)); }} className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20"><Minus size={18} /></button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  function CompetitorsTab({ competitorsData }: { competitorsData: ReturnType<typeof buildCompetitors> }) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Similarly Priced Phones</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"><GitCompare size={16} />Compare All</button>
        </div>

        {competitorsData.length === 0 ? (
          <p className="text-sm text-gray-500">No similarly priced phones found in the catalog.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {competitorsData.map((phone, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[4/3] bg-gray-50 relative">
                  <img src={phone.image} alt={phone.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3"><ScoreRing score={phone.overallScore} label="Score" size={60} /></div>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{phone.name}</h3>
                    <p className="text-lg font-bold text-orange-600">₹{fmt(phone.price)}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Display</span><span className="font-medium text-gray-900">{phone.display}</span></div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Performance</span>
                      <div className="flex items-center gap-2"><div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${phone.performanceScore}%` }} /></div><span className="font-medium text-gray-900 w-6">{phone.performanceScore}</span></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Camera</span>
                      <div className="flex items-center gap-2"><div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-purple-500 rounded-full" style={{ width: `${phone.cameraScore}%` }} /></div><span className="font-medium text-gray-900 w-6">{phone.cameraScore}</span></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Battery</span>
                      <div className="flex items-center gap-2"><div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${phone.batteryScore}%` }} /></div><span className="font-medium text-gray-900 w-6">{phone.batteryScore}</span></div>
                    </div>
                  </div>
                  <button className="w-full py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-orange-500 hover:text-orange-600 transition-colors">Compare</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  function BenchmarksTab({ benchmarkData, phone }: { benchmarkData: ReturnType<typeof buildBenchmarkData>; phone: Phone }) {
    const [category, setCategory] = useState("Performance");
    const categories = ["Performance", "Gaming"];

    return (
      <div className="space-y-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col md:flex-row gap-6 items-start">
          <img src={phone.image} alt={phone.name} className="w-28 h-36 object-contain bg-gray-50 rounded-lg" />
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900">{phone.name} AnTuTu, Geekbench &amp; 3DMark Score</h2>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>{phone.name} AnTuTu benchmark score is {fmt(benchmarkData.antutu.score)}.</li>
              <li>{phone.name} Geekbench single-core score is {fmt(benchmarkData.geekSingle)} and multi-core benchmark score is {fmt(benchmarkData.geekMulti)}</li>
              <li>{phone.name} Wild Life Extreme score is {fmt(benchmarkData.wildLifeExtreme)} and Steel Nomad score is {fmt(benchmarkData.steelNomad)}</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">{phone.name} AnTuTu Benchmark Scores with Parameters</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Parameter Name</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Score</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Percentile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="bg-white"><td className="px-6 py-3.5 font-medium text-gray-700">AnTuTu</td><td className="px-6 py-3.5 font-semibold text-gray-900">{fmt(benchmarkData.antutu.score)}</td><td className="px-6 py-3.5">{Math.min(99, Math.round((benchmarkData.antutu.score / benchmarkData.antutu.max) * 100))}.0%</td></tr>
              <tr className="bg-orange-50/40"><td className="px-6 py-3.5 font-medium text-gray-700">CPU</td><td className="px-6 py-3.5 font-semibold text-gray-900">{fmt(benchmarkData.cpu.score)}</td><td className="px-6 py-3.5">{benchmarkData.cpu.percentile}.0%</td></tr>
              <tr className="bg-white"><td className="px-6 py-3.5 font-medium text-gray-700">GPU</td><td className="px-6 py-3.5 font-semibold text-gray-900">{fmt(benchmarkData.gpu.score)}</td><td className="px-6 py-3.5">{benchmarkData.gpu.percentile}.0%</td></tr>
              <tr className="bg-orange-50/40"><td className="px-6 py-3.5 font-medium text-gray-700">Memory</td><td className="px-6 py-3.5 font-semibold text-gray-900">{fmt(benchmarkData.memory.score)}</td><td className="px-6 py-3.5">{benchmarkData.memory.percentile}.0%</td></tr>
              <tr className="bg-white"><td className="px-6 py-3.5 font-medium text-gray-700">UX</td><td className="px-6 py-3.5 font-semibold text-gray-900">{fmt(benchmarkData.ux.score)}</td><td className="px-6 py-3.5">{benchmarkData.ux.percentile}.0%</td></tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
          <h3 className="text-base font-bold text-gray-900">{phone.name} Benchmark Scores Overview</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {phone.name} is powered by the {phone.chipset} chipset. It runs on {phone.os} operating system with {phone.ram} GB RAM and {phone.storage} GB ROM.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {phone.name} has an overall AnTuTu score of {fmt(benchmarkData.antutu.score)}. The benchmark app also gives individual scores for CPU, Memory, GPU, and UX tests.
            {phone.name} scored {fmt(benchmarkData.cpu.score)} for CPU, {fmt(benchmarkData.memory.score)} for Memory, {fmt(benchmarkData.gpu.score)} for GPU, and {fmt(benchmarkData.ux.score)} for UX test.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {categories.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-colors ${category === c ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>{c}</button>
          ))}
        </div>

        {category === "Performance" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h4 className="font-bold text-gray-900 mb-1">Overall Performance (AnTuTu)</h4>
              <p className="text-xs text-gray-500 mb-4">The higher, the better</p>
              <div className="flex items-center justify-between py-2 border-t border-gray-100 bg-orange-50/40 -mx-5 px-5">
                <span className="font-semibold text-gray-900">{phone.name}</span><span className="font-bold text-gray-900">{fmt(benchmarkData.antutu.score)}</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h4 className="font-bold text-gray-900 mb-1">CPU Score</h4>
              <p className="text-xs text-gray-500 mb-4">The higher, the better</p>
              <div className="flex items-center justify-between py-2 border-t border-gray-100 bg-orange-50/40 -mx-5 px-5">
                <span className="font-semibold text-gray-900">{phone.name}</span><span className="font-bold text-gray-900">{fmt(benchmarkData.cpu.score)}</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h4 className="font-bold text-gray-900 mb-1">GPU Score</h4>
              <p className="text-xs text-gray-500 mb-4">The higher, the better</p>
              <div className="flex items-center justify-between py-2 border-t border-gray-100 bg-orange-50/40 -mx-5 px-5">
                <span className="font-semibold text-gray-900">{phone.name}</span><span className="font-bold text-gray-900">{fmt(benchmarkData.gpu.score)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h4 className="font-bold text-gray-900 mb-1">Wild Life Extreme</h4>
              <p className="text-xs text-gray-500 mb-4">The higher, the better</p>
              <div className="flex items-center justify-between py-2 border-t border-gray-100 bg-orange-50/40 -mx-5 px-5">
                <span className="font-semibold text-gray-900">{phone.name}</span><span className="font-bold text-gray-900">{fmt(benchmarkData.wildLifeExtreme)}</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h4 className="font-bold text-gray-900 mb-1">Battery Drain*</h4>
              <p className="text-xs text-gray-500 mb-4">The lower, the better</p>
              <div className="flex items-center justify-between py-2 border-t border-gray-100 bg-orange-50/40 -mx-5 px-5">
                <span className="font-semibold text-gray-900">{phone.name}</span><span className="font-bold text-gray-900">{benchmarkData.batteryDrainPct}%</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h4 className="font-bold text-gray-900 mb-1">Heating*</h4>
              <p className="text-xs text-gray-500 mb-4">The lower, the better</p>
              <div className="flex items-center justify-between py-2 border-t border-gray-100 bg-orange-50/40 -mx-5 px-5">
                <span className="font-semibold text-gray-900">{phone.name}</span><span className="font-bold text-gray-900">{benchmarkData.heatingPct}%</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 md:col-span-3">* after 30 mins of gaming</p>
          </div>
        )}
      </div>
    );
  }
