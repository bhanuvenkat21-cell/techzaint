// components/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ChevronDown, Menu, X, User } from "lucide-react";
import { navItems, megaMenus } from "@/data/siteData";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <header className="bg-[#101820] text-white sticky top-0 z-50">
      {/* Row 1: logo, search, login */}
      <div className="max-w-container mx-auto px-4 lg:px-6 h-16 flex items-center gap-4">
        <button
          className="lg:hidden text-white"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo.png"
            alt="Techinfo"
            width={32}
            height={32}
            className="rounded-md object-contain"
          />
          <span className="text-2xl font-extrabold tracking-tight">
            <span className="text-white">Tech</span>
            <span className="text-brand-orange">info</span>
          </span>
        </Link>

        <div className="hidden md:flex flex-1 max-w-xl">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search for products or brands"
              className="w-full h-10 rounded-md pl-4 pr-10 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <Search
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>
        </div>

        <div className="flex-1 md:hidden" />

        <button className="hidden md:flex items-center gap-1.5 text-sm font-medium border border-white/30 rounded-full px-4 py-1.5 hover:bg-white/10 transition-colors">
          <User size={16} />
          Login
        </button>

        <button className="md:hidden text-white" aria-label="Search">
          <Search size={20} />
        </button>
      </div>

      {/* Row 2: nav (desktop) */}
      <nav className="hidden lg:block border-t border-white/10 relative">
        <div className="max-w-container mx-auto px-4 lg:px-6 flex items-center gap-7 h-11 text-sm font-medium">
          {navItems.map((item) => {
            const menu = megaMenus[item.label];
            const isOpen = openMenu === item.label;

            return (
              <div
                key={item.label}
                className="relative h-full flex items-center"
                onMouseEnter={() => menu && setOpenMenu(item.label)}
                onMouseLeave={() => menu && setOpenMenu(null)}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 transition-colors ${
                    isOpen ? "text-white" : "text-gray-200 hover:text-white"
                  }`}
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  )}
                </Link>

                {menu && isOpen && (
                  <div className="absolute left-0 top-full mt-0 w-[min(90vw,780px)] bg-white text-gray-900 rounded-b-lg shadow-2xl border-t-2 border-brand-orange py-6 px-8 flex gap-10">
                    {menu.columns.map((columnGroup, colIdx) => (
                      <div key={colIdx} className="flex flex-col gap-6 min-w-[160px]">
                        {columnGroup.map((section) => (
                          <div key={section.heading}>
                            {section.headingHref ? (
                              <Link
                                href={section.headingHref}
                                className={`flex items-center gap-1 font-bold text-sm mb-3 hover:underline ${
                                  section.highlight ? "text-brand-orange" : "text-gray-900"
                                }`}
                              >
                                {section.heading}
                                <ChevronDown size={13} className="-rotate-90" />
                              </Link>
                            ) : (
                              <p className="font-bold text-sm mb-3 text-gray-900">
                                {section.heading}
                              </p>
                            )}
                            <ul className="flex flex-col gap-2.5">
                              {section.links.map((link) => (
                                <li key={link.label}>
                                  <Link
                                    href={link.href}
                                    className="text-sm text-gray-600 hover:text-brand-orange transition-colors"
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <nav className="lg:hidden border-t border-white/10 bg-[#101820]">
          <div className="px-4 py-3 flex flex-col">
            <div className="relative w-full mb-3">
              <input
                type="text"
                placeholder="Search for products or brands"
                className="w-full h-10 rounded-md pl-4 pr-10 text-sm text-gray-900 bg-white focus:outline-none"
              />
              <Search
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between py-3 text-sm font-medium text-gray-200 border-b border-white/10"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
                {item.hasDropdown && <ChevronDown size={14} />}
              </Link>
            ))}
            <button className="mt-4 flex items-center justify-center gap-1.5 text-sm font-medium border border-white/30 rounded-full px-4 py-2">
              <User size={16} />
              Login
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}