import { Outfit } from "next/font/google";
import localFont from "next/font/local";

export const display = localFont({src: "../public/atlasrush/fonts/barlow-condensed-bold-italic.ttf", variable: "--font-display", weight: "800", style: "italic", display: "swap"});

/** The document-owned app family, including content rendered through portals. */
export const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});
