import type { Metadata } from "next";
import "./globals.css";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Tech info| Research. Compare. Buy.",
  description:
    "A front-end clone of the 91mobiles homepage — mobiles, laptops, tablets and gadget news.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#eef1f5]">
        <TopBar />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
