import type { Metadata } from "next";
import { Suspense } from "react";
// Geist uses CSS variables with font-display: swap for fast text render
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { TopBlurBar } from "@/components/ui/TopBlurBar";
import ClientProviders from "./client-providers";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { AnalyticsPageView } from "@/components/analytics/AnalyticsPageView";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nitinsurendran.com"),
  title: {
    default: "Nitin Surendran's Portfolio",
    template: "%s | Nitin Surendran",
  },
  description:
    "Portfolio of Nitin Surendran, an interaction designer crafting 3D, spatial, and AI-powered product experiences across commerce, mobility, and immersive systems.",
  // TODO: Replace /og.jpg with a real 1200x630 social sharing image in public/og.jpg
  openGraph: {
    title: "Nitin Surendran's Portfolio",
    description:
      "Portfolio of Nitin Surendran, an interaction designer crafting 3D, spatial, and AI-powered product experiences across commerce, mobility, and immersive systems.",
    url: "https://www.nitinsurendran.com",
    siteName: "Nitin Surendran",
    type: "website",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Preview of work from Nitin Surendran's interaction design portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nitin Surendran's Portfolio",
    description:
      "Portfolio of Nitin Surendran, an interaction designer crafting 3D, spatial, and AI-powered product experiences across commerce, mobility, and immersive systems.",
    images: ["/og.jpg"],
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className={`${GeistSans.className} antialiased`}>
        <GoogleAnalytics />
        <ThemeProvider>
          <ClientProviders>
            <AnalyticsPageView />
            <TopBlurBar />
            <div className="fixed top-4 right-4 z-[10000]">
              <ThemeToggle />
            </div>
            <Suspense fallback={null}>
              {children}
            </Suspense>
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
