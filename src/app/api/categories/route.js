import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";

export async function GET() {
  try {
    await dbConnect();

    const categories = await Category.find({ isActive: true })
      .sort({ name: 1 })
      .lean();

    // Generate full URLs for images
    const categoriesWithUrls = categories.map((category) => ({
      ...category,
      image: category.image
        ? {
            ...category.image,
            url: `http://localhost:3000${category.image.url}`,
          }
        : null,
    }));

    return NextResponse.json({ categories: categoriesWithUrls });
  } catch (error) {
    console.error("Categories API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
