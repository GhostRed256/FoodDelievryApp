import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#09090b",
};

export const metadata: Metadata = {
  title: "FoodNJoy - Authentic Street Food Delivery | Tinsukia",
  description: "Order fresh momos, noodles, rolls, and Indian Chinese delicacies with real-time delivery tracking in Tinsukia.",
  keywords: ["food delivery", "tinsukia food", "assam food", "indian street food", "momos", "chowmein", "live tracking", "FoodNJoy"],
  authors: [{ name: "FoodNJoy Team" }],
  creator: "FoodNJoy",
  publisher: "FoodNJoy",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FoodNJoy",
  },
  formatDetection: {
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://food-n-joy.vercel.app",
    title: "FoodNJoy - Authentic Street Food Delivery",
    description: "Fast, fresh, and authentic street food delivery in Tinsukia.",
    siteName: "FoodNJoy",
  },
  metadataBase: new URL("https://food-n-joy.vercel.app"),
};

import { AuthProvider } from "@/lib/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 touch-manipulation">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
