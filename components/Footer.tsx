import Link from "next/link";
import { Facebook, Twitter, Youtube, Instagram, MessageCircle, Rss } from "lucide-react";

const linkColumns = [
  {
    links: [
      ["About Us", "/about"],
      ["Contact", "/contact"],
      ["Careers", "/careers"],
      ["Mobiles", "/mobiles"],
    ],
  },
  {
    links: [
      ["Brands", "/brands"],
      ["Compare", "/compare"],
      ["Upcoming", "/upcoming"],
    ],
  },
  {
    links: [
      ["Help Center", "/support"],
      ["Sell Your Phone", "/sell"],
      ["Privacy Policy", "/privacy"],
    ],
  },
];

const socials = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: MessageCircle, href: "https://wa.me/", label: "WhatsApp" },
  { icon: Rss, href: "/rss", label: "RSS" },
];

export default function Footer() {
  return (
    <footer className="mt-20">
      {/* About section */}
      <div className="bg-[#1a1a22] text-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="inline-block text-lg font-semibold text-white border-b-2 border-[#e63946] pb-2 mb-6">
            About TechInfo
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-gray-400 max-w-5xl">
            <p>
              Are you a tech lover who wants to stay updated on the latest phones, specs, and
              launches? Do you enjoy comparing honest specs and pricing before making a decision?
              If so, you&apos;ve come to the right place — welcome to TechInfo.
            </p>
            <p>
              TechInfo is your one-stop destination for everything mobile. We cover{" "}
              <Link href="/mobiles" className="underline hover:text-[#e63946]">
                phones
              </Link>
              ,{" "}
              <Link href="/brands" className="underline hover:text-[#e63946]">
                brands
              </Link>
              ,{" "}
              <Link href="/compare" className="underline hover:text-[#e63946]">
                comparisons
              </Link>
              , and{" "}
              <Link href="/upcoming" className="underline hover:text-[#e63946]">
                upcoming launches
              </Link>
              , bringing you accurate specs, real prices, and the tools to decide with confidence.
            </p>
            <p>
              We believe buying a phone shouldn&apos;t be confusing. That&apos;s why we work hard
              to keep our data relevant, reliable, and easy to compare — so you always know
              you&apos;re getting the full picture.
            </p>
          </div>
        </div>
      </div>

      {/* Links + social bar */}
      <div className="bg-[#26262e] text-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col lg:flex-row lg:items-start gap-10">
            <div className="shrink-0">
              <span className="text-2xl font-extrabold tracking-tight">
                <span className="text-white">TECH</span>
                <span className="text-[#e63946]">INFO</span>
              </span>
              <p className="text-xs text-gray-500 mt-2 max-w-[200px]">
                Compare specs, prices and the latest launches — all in one place.
              </p>
            </div>

            <div className="flex flex-1 flex-col sm:flex-row gap-10 sm:gap-16">
              {linkColumns.map((col, i) => (
                <ul key={i} className="space-y-3">
                  {col.links.map(([label, href]) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-sm text-gray-400 transition hover:text-[#e63946]"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>

            <div className="shrink-0">
              <h5 className="text-sm font-semibold text-white mb-3">Follow Us</h5>
              <div className="flex items-center gap-3">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition hover:border-[#e63946]/40 hover:bg-[#e63946]/10 hover:text-[#e63946]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} TechInfo. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
