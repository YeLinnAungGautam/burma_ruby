import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { deleteFile } from "@/lib/help";

export async function DELETE(request) {
  try {
    await dbConnect();

    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { productId, fileUrl, fileType } = body;

    if (!productId || !fileUrl || !fileType) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Check permissions
    if (userRole === "admin" && product.createdBy.toString() !== userId) {
      return NextResponse.json(
        { success: false, error: "You can only modify your own products" },
        { status: 403 }
      );
    }

    // Extract relative path from URL (remove leading slash for filesystem)
    // fileUrl can be either:
    // - Full URL: "http://localhost:3000/uploads/products/images/file.jpeg"
    // - Relative path: "/uploads/products/images/file.jpeg"
    let relativePath;

    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      // It's a full URL, extract pathname
      const url = new URL(fileUrl);
      relativePath = url.pathname.startsWith("/")
        ? url.pathname.slice(1)
        : url.pathname;
    } else {
      // It's already a relative path, remove leading slash
      relativePath = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl;
    }

    // Delete file from filesystem
    const deleted = await deleteFile(relativePath);

    if (!deleted) {
      console.warn(`File not found: ${relativePath}`);
      // Continue anyway to remove from database
    }

    // Remove file reference from database
    // Compare using the relative path format stored in DB
    const dbPath = fileUrl.startsWith("http")
      ? new URL(fileUrl).pathname
      : fileUrl;

    if (fileType === "image") {
      product.images = product.images.filter((img) => img.url !== dbPath);
    } else if (fileType === "video") {
      product.videos = product.videos.filter((vid) => vid.url !== dbPath);
    } else if (fileType === "certificate") {
      if (product.certification && product.certification.certificateImages) {
        product.certification.certificateImages =
          product.certification.certificateImages.filter(
            (img) => img.url !== dbPath
          );
      }
    }

    await product.save();

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("DELETE File Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete file" },
      { status: 500 }
    );
  }
}
