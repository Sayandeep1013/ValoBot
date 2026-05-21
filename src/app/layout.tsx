import type { Metadata } from "next";
import { Barlow_Condensed, Rajdhani, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-display",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ui",
});

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Valo.bot — Valorant Esports Intelligence",
  description: "CYPHER: Your Valorant esports intelligence agent. Teams, players, strategy, meta — all in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Valorant font — official game font via CDNFonts */}
        <link rel="preconnect" href="https://fonts.cdnfonts.com" />
        <link href="https://fonts.cdnfonts.com/css/valorant" rel="stylesheet" />
      </head>
      <body
        className={`${barlowCondensed.variable} ${rajdhani.variable} ${shareTechMono.variable}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
