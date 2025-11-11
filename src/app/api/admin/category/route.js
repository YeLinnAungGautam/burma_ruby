// app/api/admin/category/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";

import { deleteFile, generateSlug, saveImage } from "@/lib/help";

// GET - Fetch all categories
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";
    const parentId = searchParams.get("parent");

    let query = {};

    if (!includeInactive) {
      query.isActive = true;
    }

    if (parentId) {
      query.parent = parentId === "null" ? null : parentId;
    }

    const categories = await Category.find(query)
      .populate("parent", "name slug")
      .sort({ name: 1 })
      .lean();

    // Generate full URLs for images
    const categoriesWithUrls = categories.map((category) => ({
      ...category,
      _id: category._id.toString(),
      image: category.image
        ? {
            ...category.image,
            url: `${
              process.env.NEXT_PUBLIC_BASE_URL || "https://burma-rubies.com"
            }${category.image.url}`,
          }
        : null,
    }));

    return NextResponse.json({
      success: true,
      categories: categoriesWithUrls,
      count: categoriesWithUrls.length,
    });
  } catch (error) {
    console.error("GET Categories Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request) {
  try {
    await dbConnect();

    // Get user info from headers (added by middleware)
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    if (!userId || !userRole) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const parent = formData.get("parent");
    const isActive = formData.get("isActive") === "true";
    const metaTitle = formData.get("metaTitle");
    const metaDescription = formData.get("metaDescription");
    const imageFile = formData.get("image");

    // Validation
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = generateSlug(name);

    // Check if category with same slug exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: "Category with this name already exists" },
        { status: 400 }
      );
    }

    // Handle image upload
    let imageData = null;
    if (imageFile && imageFile.size > 0) {
      imageData = await saveImage(imageFile);
    }

    // Create category
    const categoryData = {
      name: name.trim(),
      slug,
      description: description?.trim() || "",
      isActive,
      metaTitle: metaTitle?.trim() || "",
      metaDescription: metaDescription?.trim() || "",
    };

    if (parent && parent !== "null") {
      categoryData.parent = parent;
    }

    if (imageData) {
      categoryData.image = imageData;
    }

    const category = await Category.create(categoryData);
    const populatedCategory = await Category.findById(category._id).populate(
      "parent",
      "name slug"
    );

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
        category: populatedCategory,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Category Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create category",
      },
      { status: 500 }
    );
  }
}

// PUT - Update category
export async function PUT(request) {
  try {
    await dbConnect();

    // Get user info from headers
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    if (!userId || !userRole) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const id = formData.get("id");
    const name = formData.get("name");
    const description = formData.get("description");
    const parent = formData.get("parent");
    const isActive = formData.get("isActive") === "true";
    const metaTitle = formData.get("metaTitle");
    const metaDescription = formData.get("metaDescription");
    const imageFile = formData.get("image");
    const removeImage = formData.get("removeImage") === "true";

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 }
      );
    }

    // Find category
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    // Update fields
    if (name && name.trim() !== category.name) {
      category.name = name.trim();
      category.slug = generateSlug(name);

      // Check if new slug already exists
      const existingCategory = await Category.findOne({
        slug: category.slug,
        _id: { $ne: id },
      });
      if (existingCategory) {
        return NextResponse.json(
          { success: false, error: "Category with this name already exists" },
          { status: 400 }
        );
      }
    }

    if (description !== undefined) category.description = description.trim();
    if (isActive !== undefined) category.isActive = isActive;
    if (metaTitle !== undefined) category.metaTitle = metaTitle.trim();
    if (metaDescription !== undefined)
      category.metaDescription = metaDescription.trim();

    // Handle parent
    if (parent !== undefined) {
      category.parent = parent && parent !== "null" ? parent : null;
    }

    // Handle image
    if (removeImage) {
      if (category.image && category.image.url) {
        await deleteFile(category.image.url);
      }
      category.image = undefined;
    } else if (imageFile && imageFile.size > 0) {
      const imageData = await saveImage(imageFile);
      category.image = imageData;
    }

    await category.save();
    const updatedCategory = await Category.findById(id).populate(
      "parent",
      "name slug"
    );

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("PUT Category Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update category",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
export async function DELETE(request) {
  try {
    await dbConnect();

    // Get user info from headers
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    if (!userId || !userRole) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if category has children
    const childCategories = await Category.countDocuments({ parent: id });
    if (childCategories > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete category with subcategories",
        },
        { status: 400 }
      );
    }

    if (category.image) {
      // await fetch(category.image.url, { method: "DELETE" });
      await deleteFile(category.image.url);
    }

    // Delete category
    await Category.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Category Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete category",
      },
      { status: 500 }
    );
  }
}
