// app/products/layout.js

export const metadata = {
  title: "Burma Rubies Collection",
  description:
    "Browse our extensive collection of certified natural rubies. High-quality gemstones with detailed specifications, certifications, and competitive pricing. Free shipping on orders over $500.",
  keywords:
    "buy rubies, natural ruby collection, certified rubies, ruby gemstones, precious stones for sale, ruby marketplace, authentic rubies",
  openGraph: {
    title: "Burma Rubies Collection | Natural Ruby Marketplace",
    description:
      "Explore our curated selection of natural rubies. Each stone is certified and verified for authenticity.",
    url: "https://burma-rubies.com/products",
    type: "website",
    images: [
      {
        url: "/favicon.ico",
        width: 1200,
        height: 630,
        alt: "Natural Ruby Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Burma Rubies Collection",
    description: "Browse certified natural rubies with detailed specifications",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://burma-rubies.com/products",
  },
};

export default function ProductsLayout({ children }) {
  return (
    <div className="products-container">
      {/* Optional: Add breadcrumb schema or structured data here */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Natural Ruby Collection",
            description:
              "Browse our collection of certified natural rubies with detailed specifications and certifications.",
            url: "https://burma-rubies.com/products",
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://burma-rubies.com",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Products",
                  item: "https://burma-rubies.com/products",
                },
              ],
            },
          }),
        }}
      />
      {children}
    </div>
  );
}
