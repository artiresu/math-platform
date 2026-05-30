import type { Metadata } from "next";
import {
  Geist_Mono,
  Plus_Jakarta_Sans,
  Source_Serif_4,
} from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "University Maths Admissions Hub",
  description:
    "Master A-Level Maths and prepare for TMUA and STEP for top UK universities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${sourceSerif.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-screen bg-slate-950 font-sans text-white antialiased">
        {children}
      </body>
    </html>
  );
}
