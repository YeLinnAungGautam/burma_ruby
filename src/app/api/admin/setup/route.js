import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(request) {
  try {
    await dbConnect();

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: "superadmin" });
    if (existingSuperAdmin) {
      return NextResponse.json(
        { error: "Super admin already exists" },
        { status: 400 }
      );
    }

    // const { name, email, password } = await request.json();

    const superAdmin = await User.create({
      name: "Super Admin",
      email: "admin@gmail.com",
      password: "Admin@123",
      role: "superadmin",
    });

    return NextResponse.json({
      message: "Super admin created successfully",
      user: {
        id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
        role: superAdmin.role,
      },
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "Failed to create super admin" },
      { status: 500 }
    );
  }
}
