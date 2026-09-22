"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  ArrowRight,
  Signal,
  MemoryStick,
  HardDrive,
  Minimize2,
  Gauge,
  Sparkles,
  Smartphone,
} from "lucide-react";
import { featuredBrands, phones, popularFeatures, type Phone, type Brand } from "@/data/siteData";
import { slugify } from "@/lib/specGenerator";

const ICONS: Record<string, React.ElementType> = {
  signal: Signal,
  memory: MemoryStick,
  storage: HardDrive,
  slim: Minimize2,
  refresh: Gauge,
  ai: Sparkles,
};

// Accent gradient per feature tile, cycled if there are more features than colors.
// Add/edit entries here to change or extend the palette.
const FEATURE_ACCENTS = [
  { bg: "from-indigo-100 to-blue-50", icon: "bg-indigo-500 text-white" },
  { bg: "from-sky-100 to-cyan-50", icon: "bg-sky-500 text-white" },
  { bg: "from-emerald-100 to-lime-50", icon: "bg-emerald-500 text-white" },
  { bg: "from-orange-100 to-amber-50", icon: "bg-orange-500 text-white" },
  { bg: "from-fuchsia-100 to-pink-50", icon: "bg-fuchsia-500 text-white" },
  { bg: "from-violet-100 to-purple-50", icon: "bg-violet-500 text-white" },
];

// Quick price picks shown as chips below the feature tiles.
// Add or remove numbers here to change what's offered — no other code needs to change.
const PRICE_POINTS = [10000, 15000, 20000, 25000, 30000, 40000, 50000, 70000];

// Extra keywords per feature so typing "5g", "ram" etc. also surfaces it,
// not just the literal label text.
const FEATURE_ALIASES: Record<string, string[]> = {
  "5G Phones": ["5g", "five g", "network"],
  "8GB & Above RAM": ["ram", "8gb", "memory", "8 gb"],
  "256 GB & Above Memory": ["storage", "256gb", "256 gb", "memory"],
  "Slimmest Phones": ["slim", "thin", "lightweight"],
  "120Hz Refresh Rate": ["120hz", "refresh rate", "smooth display", "high refresh"],
  "AI Smartphones": ["ai", "artificial intelligence", "smart"],
};

// Only "5g" has a real page at app/feature/[type]/page.tsx right now.
// Everything else routes to the finder until dedicated pages exist.
const FEATURE_ROUTES: Record<string, string> = {
  "5G Phones": "/feature/5g",
};
const FEATURE_FALLBACK_ROUTE = "/mobiles/finder";

type Suggestion =
  | { kind: "brand"; brand: Brand }
  | { kind: "phone"; phone: Phone }
  | { kind: "feature"; feature: (typeof popularFeatures)[number] };

export default function MobileFinder() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const suggestions: Suggestion[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const featureMatches = popularFeatures
      .filter((f) => {
        const label = f.label.toLowerCase();
        const aliases = FEATURE_ALIASES[f.label] ?? [];
        return label.includes(q) || aliases.some((a) => a.includes(q) || q.includes(a));
      })
      .map((feature): Suggestion => ({ kind: "feature", feature }));

    const brandMatches = featuredBrands
      .filter((b) => b.name.toLowerCase().includes(q))
      .slice(0, 4)
      .map((brand): Suggestion => ({ kind: "brand", brand }));

    const phoneMatches = phones
      .filter((p) => p.name.toLowerCase().includes(q))
      .slice(0, 6)
      .map((phone): Suggestion => ({ kind: "phone", phone }));

    return [...featureMatches, ...brandMatches, ...phoneMatches].slice(0, 10);
  }, [query]);

  function goToSuggestion(s: Suggestion) {
    if (s.kind === "brand") {
      router.push(`/mobiles/${s.brand.slug}`);
    } else if (s.kind === "phone") {
      // Matches app/mobiles/[brand]/[phone]/page.tsx exactly, since it uses
      // the same slugify() from lib/specGenerator to look phones up.
      router.push(`/mobiles/${s.phone.brand}/${slugify(s.phone.name)}`);
    } else {
      router.push(FEATURE_ROUTES[s.feature.label] ?? FEATURE_FALLBACK_ROUTE);
    }
    setOpen(false);
    setQuery("");
  }

  function handleFindMobiles() {
    if (suggestions.length > 0 && activeIndex >= 0) {
      goToSuggestion(suggestions[activeIndex]);
      return;
    }
    const q = query.trim();
    router.push(q ? `/mobiles/finder?q=${encodeURIComponent(q)}` : "/mobiles/finder");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) {
      if (e.key === "Enter") handleFindMobiles();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) goToSuggestion(suggestions[activeIndex]);
      else handleFindMobiles();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-slate-50 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(15,23,42,0.15)] px-6 py-10 sm:px-10">
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-200/40 to-sky-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-gradient-to-tr from-orange-100/50 to-rose-100/30 blur-3xl" />

      <div className="relative flex flex-col gap-1 mb-8">
        <h2 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight">
          Let&apos;s Find a Mobile for You!
        </h2>
        <p className="text-sm text-slate-500">
          Search any brand, model, or feature — like &ldquo;5G&rdquo; or &ldquo;120Hz&rdquo;.
        </p>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-10">
        <div ref={containerRef} className="relative flex flex-col">
          <label className="text-xs font-semibold tracking-wide text-slate-500 mb-2">
            SEARCH BY BRAND, MODEL OR FEATURE
          </label>

          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
                setActiveIndex(-1);
              }}
              onFocus={() => query && setOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search mobile brands, models, or features..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3.5 pl-11 pr-4 text-[15px] text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />

            {open && suggestions.length > 0 && (
              <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <ul className="max-h-96 overflow-y-auto py-1.5">
                  {suggestions.map((s, i) => {
                    const active = i === activeIndex;

                    if (s.kind === "feature") {
                      const Icon = ICONS[s.feature.icon] ?? Sparkles;
                      return (
                        <li key={`feature-${s.feature.label}`}>
                          <button
                            onMouseEnter={() => setActiveIndex(i)}
                            onClick={() => goToSuggestion(s)}
                            className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
                              active ? "bg-indigo-50" : "hover:bg-slate-50"
                            }`}
                          >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="text-sm text-slate-700">
                              <span className="font-medium text-slate-900">{s.feature.label}</span>{" "}
                              <span className="text-slate-400">— browse feature</span>
                            </span>
                          </button>
                        </li>
                      );
                    }

                    if (s.kind === "brand") {
                      return (
                        <li key={`brand-${s.brand.slug}`}>
                          <button
                            onMouseEnter={() => setActiveIndex(i)}
                            onClick={() => goToSuggestion(s)}
                            className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
                              active ? "bg-indigo-50" : "hover:bg-slate-50"
                            }`}
                          >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 overflow-hidden">
                              <Image
                                src={s.brand.image}
                                alt={s.brand.name}
                                width={20}
                                height={20}
                                className="object-contain"
                              />
                            </span>
                            <span className="text-sm text-slate-700">
                              <span className="font-medium text-slate-900">{s.brand.name}</span>{" "}
                              <span className="text-slate-400">— view all mobiles</span>
                            </span>
                          </button>
                        </li>
                      );
                    }

                    return (
                      <li key={`phone-${s.phone.id}`}>
                        <button
                          onMouseEnter={() => setActiveIndex(i)}
                          onClick={() => goToSuggestion(s)}
                          className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
                            active ? "bg-indigo-50" : "hover:bg-slate-50"
                          }`}
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                            <Smartphone className="h-4 w-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-slate-900">
                              {s.phone.name}
                            </span>
                            <span className="block text-xs text-slate-400">
                              ₹{s.phone.price.toLocaleString("en-IN")}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {open && query && suggestions.length === 0 && (
              <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-400 shadow-xl">
                No matches for &ldquo;{query}&rdquo;. Try a different brand, model, or feature.
              </div>
            )}
          </div>

          <button
            onClick={handleFindMobiles}
            className="group mt-4 flex items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 text-[15px] font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99]"
          >
            Find Mobiles
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs font-semibold tracking-wide text-slate-500 mb-2">
              POPULAR FEATURES
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {popularFeatures.map((f, idx) => {
                const Icon = ICONS[f.icon] ?? Sparkles;
                const accent = FEATURE_ACCENTS[idx % FEATURE_ACCENTS.length];
                return (
                  <button
                    key={f.label}
                    onClick={() => router.push(FEATURE_ROUTES[f.label] ?? FEATURE_FALLBACK_ROUTE)}
                    className={`group flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-gradient-to-br ${accent.bg} px-4 py-3.5 text-left transition hover:-translate-y-0.5 hover:shadow-md`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ${accent.icon}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-[15px] font-medium text-slate-800">{f.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wide text-slate-500 mb-2">
              BROWSE BY PRICE
            </p>
            <div className="flex flex-wrap gap-2.5">
              {PRICE_POINTS.map((price) => (
                <button
                  key={price}
                  onClick={() => router.push(`/mobiles/finder?maxPrice=${price}`)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-sm"
                >
                  Under ₹{price.toLocaleString("en-IN")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
