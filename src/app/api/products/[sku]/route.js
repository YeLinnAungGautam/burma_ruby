import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import Category from "@/models/Category";
import User from "@/models/User"; // Import User model

// GET - Single product by SKU
export async function GET(request, { params }) {
  try {
    await dbConnect();

    // Await the params promise in Next.js 16
    const { sku } = await params;

    if (!sku) {
      return NextResponse.json(
        { success: false, error: "SKU parameter is required" },
        { status: 400 }
      );
    }

    // Find product by SKU with moderation and status filters
    const product = await Product.findOne({
      sku: sku,
      status: "available",
      "moderation.status": "approved",
    })
      .populate("category", "name slug description")
      .populate("createdBy", "name official_email") // This requires User model
      .lean();

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Construct full URLs for media files
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const productWithUrls = {
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
    };

    return NextResponse.json({
      success: true,
      data: productWithUrls,
    });
  } catch (error) {
    console.error("Product Detail API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product details" },
      { status: 500 }
    );
  }
}
