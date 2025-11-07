import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

export async function POST(request) {
  try {
    await dbConnect();

    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    // Only superadmin can approve
    if (userRole !== "superadmin") {
      return NextResponse.json(
        {
          success: false,
          error: "Only superadmin can approve/reject products",
        },
        { status: 403 }
      );
    }

    const { productId, action, rejectionReason } = await request.json();

    if (!productId || !action) {
      return NextResponse.json(
        { success: false, error: "Product ID and action are required" },
        { status: 400 }
      );
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid action. Must be "approve" or "reject"',
        },
        { status: 400 }
      );
    }

    if (action === "reject" && !rejectionReason) {
      return NextResponse.json(
        { success: false, error: "Rejection reason is required" },
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

    // Use schema methods
    if (action === "approve") {
      await product.approve(userId);
    } else {
      await product.reject(userId, rejectionReason);
    }

    const updatedProduct = await Product.findById(productId)
      .populate("createdBy", "name email role")
      .populate("moderation.approvedBy", "name email");

    return NextResponse.json({
      success: true,
      message: `Product ${action}d successfully`,
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Approve Product Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update product status",
      },
      { status: 500 }
    );
  }
}
