import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import Category from "@/models/Category";
import User from "@/models/User";

export async function GET(request) {
  try {
    // Check if user is authenticated via middleware headers
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    if (!userId || !userRole || !["superadmin", "admin"].includes(userRole)) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await dbConnect();

    const [
      totalProducts,
      approvedProducts,
      pendingProducts,
      totalCategories,
      totalUsers,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: "approved" }),
      Product.countDocuments({ status: "pending" }),
      Category.countDocuments({ isActive: true }),
      User.countDocuments({ role: { $in: ["admin", "superadmin"] } }),
    ]);

    return NextResponse.json({
      stats: {
        totalProducts,
        approvedProducts,
        pendingProducts,
        totalCategories,
        totalUsers,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
