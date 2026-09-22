# 91mobiles Clone

A responsive front-end clone of the 91mobiles homepage, built with Next.js 14 (App Router), TypeScript, and Tailwind CSS. Fully responsive — works on mobile, tablet, and desktop.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Project structure

```
app/
  layout.tsx          Root layout, global metadata
  page.tsx             Homepage — assembles all sections
  globals.css          Tailwind base + small utilities
components/
  TopBar.tsx            Black utility strip (tagline + latest mobiles)
  Header.tsx             Logo, search bar, nav, mobile menu
  NewsHeroWidget.tsx      Large hero article + 3-item sidebar, paginated
  FeaturedNews.tsx         "Featured News" horizontal rail
  MobileFinder.tsx          Price range slider + popular features
  BuyCategories.tsx          "What are you looking to buy?" grid
  PriceChips.tsx               Reusable price-pill grid
  FinderSection.tsx             Layout wrapper for the finder row
  FeaturedBrands.tsx             Brand logos rail
  UpcomingMobiles.tsx             Upcoming phones rail w/ spec-score badge
  BestOfSection.tsx                Reusable "Best of Mobiles/Laptops" block
  FeaturedComparisons.tsx           "Phone A vs Phone B" comparison rail
  ScrollRail.tsx                     Shared horizontal-scroll section wrapper
  Footer.tsx                          Site footer
data/
  siteData.ts          All mock content in one place — swap for a real API/CMS
```

## Notes

- All images use `picsum.photos` placeholders — swap the URLs in `data/siteData.ts` for real product/article images.
- `next.config.js` whitelists `picsum.photos` and `images.unsplash.com` for `next/image`. Add your own image host there if needed.
- Icons are from `lucide-react`.
- Every section is mobile-first: the header collapses into a hamburger menu, horizontal rails become swipeable, and grids reflow to 1–2 columns on small screens.
