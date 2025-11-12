import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product }) {
  const mainImage = product.images?.[0] || {
    url: "/images/placeholder.jpg",
    alt: product.name,
  };

  // Format price with currency
  const formatPrice = (price, currency) => {
    if (currency === "MMK") {
      return `${price.toLocaleString()} MMK`;
    }
    return `$${price.toLocaleString()}`;
  };

  // Get badge text
  const getBadges = () => {
    const badges = [];
    if (product.features?.pigeonBlood) badges.push("Pigeon Blood");

    if (product.features?.certified) badges.push("Certified");
    return badges;
  };

  return (
    <Link href={`/products/${product.sku}`}>
      <div className="group cursor-pointer pb-2 rounded-3xl relative overflow-hidden">
        {/* Animated linear wave overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
          <div className="absolute inset-0 bg-linear-to-t from-ruby-600/50 via-pink-500/40 to-transparent animate-wave" />
        </div>

        {/* Image Container */}
        <div className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden mb-4">
          <Image
            src={mainImage.url}
            alt={mainImage.alt || product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Badges */}
          {getBadges().length > 0 && (
            <div className="absolute bottom-0 right-2 flex flex-col gap-2">
              {getBadges()
                .slice(0, 2)
                .map((badge, index) => (
                  <span
                    key={index}
                    className="inline-block bg-linear-to-br from-red-600 to-pink-800 backdrop-blur-xl text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg"
                  >
                    {badge}
                  </span>
                ))}
            </div>
          )}

          {/* Status Badge */}
          {product.status === "sold" && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-white text-gray-900 px-6 py-2 rounded-full text-sm font-semibold">
                Sold
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1 px-2 pb-1 relative z-20">
          {/* Color - Using Apple's product color naming style */}
          {product.color?.grade && (
            <p className="text-xs font-medium text-ruby-600 uppercase tracking-wide">
              {product.color.grade.replace("-", " ")}
            </p>
          )}

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-ruby-600 transition-colors">
            {product.name}
          </h3>

          {/* Specs - Minimalist approach */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{product.carat} ct</span>
            <span className="text-gray-300">•</span>
            <span className="capitalize">{product.shape}</span>
            {product.clarity?.grade && (
              <>
                <span className="text-gray-300">•</span>
                <span>{product.clarity.grade}</span>
              </>
            )}
          </div>

          {/* Origin */}
          {product.origin?.country && (
            <p className="text-xs text-gray-500">
              {product.origin.region}, {product.origin.country}
            </p>
          )}

          {/* Price */}
          <div className="pt-1">
            <p className="text-xl font-semibold text-gray-900 line-clamp-1 group-hover:text-ruby-600 transition-colors">
              {formatPrice(product.price.amount, product.price.currency)}
            </p>
            {product.price.pricePerCarat && (
              <p className="text-xs text-gray-500">
                {formatPrice(
                  product.price.pricePerCarat,
                  product.price.currency
                )}
                /ct
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
