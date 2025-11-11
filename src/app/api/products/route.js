import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import Category from "@/models/Category";

// GET - Public products
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");

    // Fixed: Correct query filters matching the document
    const query = {
      status: "available",
      "moderation.status": "approved",
    };
    const skip = (page - 1) * limit;

    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    if (featured === "true") {
      query.featured = true;
    }

    // Fixed: Using $regex with $or like in the document
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { "description.full": { $regex: search, $options: "i" } },
        { "description.short": { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("category", "name slug")
        .sort({ featured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    // Fixed: Using environment variable and correct field names
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://burma-rubies.com";
    const productsWithUrls = products.map((product) => ({
      ...product,
      images: product.images?.map((img) => ({
        ...img,
        url: img.url.startsWith("http") ? img.url : `${baseUrl}${img.url}`,
      })),
      videos: product.videos?.map((video) => ({
        ...video,
        url: video.url?.startsWith("http")
          ? video.url
          : `${baseUrl}${video.url}`,
        thumbnail: video.thumbnail?.startsWith("http")
          ? video.thumbnail
          : `${baseUrl}${video.thumbnail}`,
      })),
      // Fixed: Correct field name for certificates
      certification: product.certification?.certificateImages
        ? {
            ...product.certification,
            certificateImages: product.certification.certificateImages.map(
              (img) => ({
                ...img,
                url: img.url.startsWith("http")
                  ? img.url
                  : `${baseUrl}${img.url}`,
              })
            ),
          }
        : product.certification,
    }));

    return NextResponse.json({
      success: true,
      data: productsWithUrls,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Products API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
