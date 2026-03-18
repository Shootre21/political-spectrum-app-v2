import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO Configuration
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://political-spectrum-app.vercel.app";
const siteName = "Political Spectrum App";
const defaultDescription = "Analyze media bias with AI-powered algorithms. Detect political leanings in news articles from 35+ outlets. Transparent, evidence-based analysis with no rigid labels.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  // Basic Meta
  title: {
    default: `${siteName} - AI-Powered Media Bias Analysis`,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: [
    "political spectrum",
    "media bias",
    "news analysis",
    "political leanings",
    "media transparency",
    "AI analysis",
    "sentiment analysis",
    "news bias detector",
    "journalism",
    "fact checking",
    "media literacy",
    "political analysis",
    "news aggregator",
    "bias detection",
    "outlet ratings",
    "source credibility",
  ],
  authors: [{ name: "Shootre21", url: "https://github.com/Shootre21" }],
  creator: "Shootre21",
  publisher: "Shootre21",
  
  // Icons & Branding
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  
  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteName,
    title: `${siteName} - AI-Powered Media Bias Analysis`,
    description: defaultDescription,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Political Spectrum App - Media Bias Analysis Dashboard",
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@shootre21",
    creator: "@shootre21",
    title: `${siteName} - AI-Powered Media Bias Analysis`,
    description: defaultDescription,
    images: ["/og-image.png"],
  },
  
  // Robots & Indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Verification (add your own verification codes)
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
  
  // Alternates
  alternates: {
    canonical: siteUrl,
  },
  
  // Category
  category: "News & Media Analysis",
  
  // App Info
  applicationName: siteName,
  appleWebApp: {
    capable: true,
    title: siteName,
    statusBarStyle: "default",
  },
  
  // Format Detection
  formatDetection: {
    telephone: false,
  },
  
  // Other
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: siteName,
  description: defaultDescription,
  url: siteUrl,
  applicationCategory: "NewsApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Shootre21",
    url: "https://github.com/Shootre21",
  },
  features: [
    "AI-powered media bias analysis",
    "35+ news outlets database",
    "3-layer scoring algorithm",
    "Author political leanings tracking",
    "Analytics dashboard",
    "Round-robin AI provider support",
  ],
  screenshot: `${siteUrl}/og-image.png`,
  softwareVersion: "2.5.0",
  datePublished: "2025-01-18",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "150",
    bestRating: "5",
    worstRating: "1",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
