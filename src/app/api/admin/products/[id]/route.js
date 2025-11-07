// app/api/admin/products/[id]/route.js
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const product = await Product.findById(params.id)
      .populate("category", "name slug")
      .populate("createdBy", "name email")
      .populate("approvedBy", "name email");

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("GET Product Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
