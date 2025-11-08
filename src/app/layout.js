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
    default: "Burma-rubies - Premium Quality Rubies",
    template: "%s | Burma-rubies",
  },
  description:
    "Discover our exclusive collection of premium natural rubies. Certified quality with best prices in the market. Buy authentic rubies with proper certification.",
  keywords:
    "ruby, gemstones, natural rubies, precious stones, ruby jewelry, certified rubies",
  authors: [{ name: "Burma-rubies" }],
  creator: "Burma-rubies",
  publisher: "Burma-rubies",
  metadataBase: new URL("https://burma-rubies.com"),

  // Add icons here
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://burma-rubies.com",
    siteName: "Burma-rubies",
    title: "Burma-rubies - Premium Quality Rubies",
    description: "Discover our exclusive collection of premium natural rubies.",
    images: [
      {
        url: "/favicon.ico",
        width: 1200,
        height: 630,
        alt: "Burma-rubies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Burma-rubies - Premium Quality Rubies",
    description: "Discover our exclusive collection of premium natural rubies.",
    images: ["/favicon.ico"],
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
      {/* Remove the head tag - Next.js handles it automatically */}
      <BodyCleanup>{children}</BodyCleanup>
    </html>
  );
}
