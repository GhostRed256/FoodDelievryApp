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
  themeColor: "#052e16",
};

export const metadata: Metadata = {
  title: "FoodNJoy - The Tinsukia Canteen | Good Food • Good Mood",
  description: "FoodNJoy – The Tinsukia Canteen. Good Food • Good Mood. Authentic momos, rolls, Indian classics, Chinese, Korean, and local specialities delivered hot in Tinsukia.",
  keywords: ["food delivery", "tinsukia canteen", "foodnjoy", "tinsukia food", "assam food", "indian cuisine", "momos", "chowmein", "live tracking"],
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg"
  },
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
    title: "FoodNJoy - The Tinsukia Canteen",
    description: "Good Food • Good Mood. Fast, fresh, and authentic food delivery in Tinsukia.",
    siteName: "FoodNJoy",
  },
  metadataBase: new URL("https://food-n-joy.vercel.app"),
};

import { AuthProvider } from "@/lib/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
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
      <body className="min-h-full flex flex-col bg-[#f7fbf8] dark:bg-[#040905] text-[#042111] dark:text-[#f4fbf6] touch-manipulation transition-colors duration-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
