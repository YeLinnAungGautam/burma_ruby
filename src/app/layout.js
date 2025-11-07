import { TASA_Orbiter } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/providers/ToastProvider";
import { AuthProvider } from "@/context/AuthContext";

const inter = TASA_Orbiter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Natural Ruby Marketplace - Premium Quality Rubies",
    template: "%s | Natural Ruby Marketplace",
  },
  description:
    "Discover our exclusive collection of premium natural rubies. Certified quality with best prices in the market. Buy authentic rubies with proper certification.",
  keywords:
    "ruby, gemstones, natural rubies, precious stones, ruby jewelry, certified rubies",
  authors: [{ name: "Natural Ruby Marketplace" }],
  creator: "Natural Ruby Marketplace",
  publisher: "Natural Ruby Marketplace",
  metadataBase: new URL("https://ruby-marketplace.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ruby-marketplace.com",
    siteName: "Natural Ruby Marketplace",
    title: "Natural Ruby Marketplace - Premium Quality Rubies",
    description: "Discover our exclusive collection of premium natural rubies.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Natural Ruby Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Natural Ruby Marketplace - Premium Quality Rubies",
    description: "Discover our exclusive collection of premium natural rubies.",
    images: ["/images/og-image.jpg"],
  },
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
};

// Component to remove extension attributes
function BodyCleanup({ children }) {
  return (
    <body className="min-h-screen bg-white" suppressHydrationWarning>
      <AuthProvider>
        {children}
        <ToastProvider />
      </AuthProvider>
    </body>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <BodyCleanup>{children}</BodyCleanup>
    </html>
  );
}
