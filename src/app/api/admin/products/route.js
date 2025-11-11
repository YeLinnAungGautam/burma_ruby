import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { generateSlug, saveFile, deleteFile } from "@/lib/help";

// Helper: Generate unique SKU
async function generateSKU() {
  const prefix = "RBY";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  const sku = `${prefix}-${timestamp}-${random}`;

  const existing = await Product.findOne({ sku });
  if (existing) {
    return generateSKU();
  }

  return sku;
}

// ============================================
// GET - Fetch all products
// ============================================
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);

    // Get user info from headers
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    // Filters
    const status = searchParams.get("status");
    const moderationStatus = searchParams.get("moderationStatus");
    const shape = searchParams.get("shape");
    const colorGrade = searchParams.get("colorGrade");
    const origin = searchParams.get("origin");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const unheated = searchParams.get("unheated");
    const categoryId = searchParams.get("category");

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Sort
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    // Build query
    let query = {};

    // Role-based filtering: if not superadmin, only show products created by this user
    if (userRole !== "superadmin" && userId) {
      query.createdBy = userId;
    }

    if (status) query.status = status;
    if (moderationStatus) query["moderation.status"] = moderationStatus;
    if (shape) query.shape = shape;
    if (colorGrade) query["color.grade"] = colorGrade;
    if (origin) query["origin.country"] = origin;
    if (featured === "true") query.featured = true;
    if (unheated === "true") query["treatment.heated"] = false;
    if (categoryId) query.category = categoryId;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { "description.full": { $regex: search, $options: "i" } },
        { "description.short": { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Execute query
    const products = await Product.find(query)
      .populate({
        path: "category",
        select: "name slug",
      })
      .populate({
        path: "createdBy",
        select: "name email role",
      })
      .populate({
        path: "moderation.approvedBy",
        select: "name email",
      })
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(query);

    // Add full URLs to media
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
        hasMore: page < Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET Products Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// ============================================
// POST - Create new product
// ============================================
export async function POST(request) {
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

    const formData = await request.formData();

    // Parse JSON fields
    const colorData = formData.get("color");
    const clarityData = formData.get("clarity");
    const cutData = formData.get("cut");
    const dimensionsData = formData.get("dimensions");
    const originData = formData.get("origin");
    const treatmentData = formData.get("treatment");
    const certificationData = formData.get("certification");
    const priceData = formData.get("price");
    const descriptionData = formData.get("description");

    // Basic fields
    const name = formData.get("name");
    const shape = formData.get("shape");
    const carat = parseFloat(formData.get("carat"));
    const categoryId = formData.get("category");
    const phenomenonType = formData.get("phenomenonType") || "none";
    const featured = formData.get("featured") === "true";
    const tags = formData.get("tags");
    const metaTitle = formData.get("metaTitle");
    const metaDescription = formData.get("metaDescription");
    const buyingRate = formData.get("buyingCurrencyRateToMMK");

    // Validation
    if (
      !name ||
      !shape ||
      !carat ||
      !categoryId ||
      !colorData ||
      !clarityData ||
      !cutData ||
      !dimensionsData ||
      !originData ||
      !priceData
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify category exists and get category name
    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        { success: false, error: "Invalid category" },
        { status: 400 }
      );
    }
    const categoryName = category.name;

    // Parse JSON data
    const color = JSON.parse(colorData);
    const clarity = JSON.parse(clarityData);
    const cut = JSON.parse(cutData);
    const dimensions = JSON.parse(dimensionsData);
    const origin = JSON.parse(originData);
    const treatment = treatmentData
      ? JSON.parse(treatmentData)
      : { heated: true, treatmentType: "heated" };
    const certification = certificationData
      ? JSON.parse(certificationData)
      : { hasCertificate: false };
    const price = JSON.parse(priceData);
    const description = descriptionData ? JSON.parse(descriptionData) : {};

    // Generate slug and SKU
    const slug = generateSlug(name);
    const sku = await generateSKU();

    // Check duplicate slug
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: "Product with this name already exists" },
        { status: 400 }
      );
    }

    // Handle file uploads
    const images = [];
    const imageFiles = formData.getAll("images");
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      if (file && file.size > 0) {
        const imageData = await saveFile(file, "products/images");
        images.push({
          ...imageData,
          type: i === 0 ? "main" : "daylight",
          isPrimary: i === 0,
          order: i,
        });
      }
    }

    const videos = [];
    const videoFiles = formData.getAll("videos");
    for (const file of videoFiles) {
      if (file && file.size > 0) {
        const videoData = await saveFile(file, "products/videos");
        videos.push(videoData);
      }
    }

    // Handle certificate images
    const certificateImages = [];
    const certFiles = formData.getAll("certificateImages");
    for (const file of certFiles) {
      if (file && file.size > 0) {
        const certData = await saveFile(file, "products/certificates");
        certificateImages.push(certData);
      }
    }

    if (certificateImages.length > 0) {
      certification.certificateImages = certificateImages;
    }

    // Determine moderation status based on user role
    let moderationStatus = "pending";
    let productStatus = "pending";
    let approvedBy = null;
    let approvedAt = null;

    if (userRole === "superadmin") {
      moderationStatus = "approved";
      productStatus = "available";
      approvedBy = userId;
      approvedAt = new Date();
    }

    // Create product
    const productData = {
      name: name.trim(),
      categoryName,
      category: categoryId,
      slug,
      sku,
      shape,
      carat,
      color,
      clarity,
      cut,
      dimensions,
      origin,
      treatment,
      certification,
      phenomenonType,
      images,
      videos,
      price,
      description,
      status: productStatus,
      moderation: {
        status: moderationStatus,
        approvedBy,
        approvedAt,
      },
      featured,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      metaTitle: metaTitle?.trim() || name.trim(),
      metaDescription: metaDescription?.trim() || description?.short || "",
      buyingCurrencyRateToMMK: buyingRate ? parseFloat(buyingRate) : undefined,
      createdBy: userId,
    };

    const product = await Product.create(productData);

    const populatedProduct = await Product.findById(product._id)
      .populate("category", "name slug")
      .populate("createdBy", "name email role")
      .populate("moderation.approvedBy", "name email");

    return NextResponse.json(
      {
        success: true,
        message:
          userRole === "superadmin"
            ? "Product created and auto-approved"
            : "Product created and pending approval",
        data: populatedProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Product Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}

// ============================================
// PUT - Update product
// ============================================
export async function PUT(request) {
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

    const formData = await request.formData();
    const id = formData.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Check permissions
    if (userRole === "admin" && product.createdBy.toString() !== userId) {
      return NextResponse.json(
        { success: false, error: "You can only edit your own products" },
        { status: 403 }
      );
    }

    // Update basic fields
    const name = formData.get("name");
    if (name && name.trim() !== product.name) {
      product.name = name.trim();
      product.slug = generateSlug(name);

      const existingProduct = await Product.findOne({
        slug: product.slug,
        _id: { $ne: id },
      });
      if (existingProduct) {
        return NextResponse.json(
          { success: false, error: "Product with this name already exists" },
          { status: 400 }
        );
      }
    }

    // Update category if provided
    const categoryId = formData.get("category");
    if (categoryId && categoryId !== product.category?.toString()) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return NextResponse.json(
          { success: false, error: "Invalid category" },
          { status: 400 }
        );
      }
      product.category = categoryId;
      product.categoryName = category.name;
    }

    // Update fields if provided
    if (formData.get("shape")) product.shape = formData.get("shape");
    if (formData.get("carat"))
      product.carat = parseFloat(formData.get("carat"));
    if (formData.get("phenomenonType"))
      product.phenomenonType = formData.get("phenomenonType");
    if (formData.get("featured") !== null)
      product.featured = formData.get("featured") === "true";
    if (formData.get("metaTitle"))
      product.metaTitle = formData.get("metaTitle").trim();
    if (formData.get("metaDescription"))
      product.metaDescription = formData.get("metaDescription").trim();
    if (formData.get("buyingCurrencyRateToMMK")) {
      product.buyingCurrencyRateToMMK = parseFloat(
        formData.get("buyingCurrencyRateToMMK")
      );
    }

    // Update complex fields
    if (formData.get("color"))
      product.color = JSON.parse(formData.get("color"));
    if (formData.get("clarity"))
      product.clarity = JSON.parse(formData.get("clarity"));
    if (formData.get("cut")) product.cut = JSON.parse(formData.get("cut"));
    if (formData.get("dimensions"))
      product.dimensions = JSON.parse(formData.get("dimensions"));
    if (formData.get("origin"))
      product.origin = JSON.parse(formData.get("origin"));
    if (formData.get("treatment"))
      product.treatment = JSON.parse(formData.get("treatment"));
    if (formData.get("certification"))
      product.certification = JSON.parse(formData.get("certification"));
    if (formData.get("price"))
      product.price = JSON.parse(formData.get("price"));
    if (formData.get("description"))
      product.description = JSON.parse(formData.get("description"));
    if (formData.get("tags")) {
      product.tags = formData
        .get("tags")
        .split(",")
        .map((tag) => tag.trim());
    }

    // Handle new images
    const newImageFiles = formData.getAll("newImages");
    for (let i = 0; i < newImageFiles.length; i++) {
      const file = newImageFiles[i];
      if (file && file.size > 0) {
        const imageData = await saveFile(file, "products/images");
        product.images.push({
          ...imageData,
          type: "daylight",
          order: product.images.length + i,
        });
      }
    }

    // Handle new videos
    const newVideoFiles = formData.getAll("newVideos");
    for (const file of newVideoFiles) {
      if (file && file.size > 0) {
        const videoData = await saveFile(file, "products/videos");
        product.videos.push(videoData);
      }
    }

    // Handle new certificate images
    const newCertFiles = formData.getAll("newCertificateImages");
    for (const file of newCertFiles) {
      if (file && file.size > 0) {
        const certData = await saveFile(file, "products/certificates");
        if (!product.certification.certificateImages) {
          product.certification.certificateImages = [];
        }
        product.certification.certificateImages.push(certData);
      }
    }

    // If admin updates approved product, set back to pending
    if (userRole === "admin" && product.moderation.status === "approved") {
      product.moderation.status = "pending";
      product.moderation.approvedBy = null;
      product.moderation.approvedAt = null;
      product.status = "pending";
    }

    await product.save();

    const updatedProduct = await Product.findById(id)
      .populate("category", "name slug")
      .populate("createdBy", "name email role")
      .populate("moderation.approvedBy", "name email");

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("PUT Product Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE - Delete product
// ============================================
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Check permissions
    if (userRole === "admin" && product.createdBy.toString() !== userId) {
      return NextResponse.json(
        { success: false, error: "You can only delete your own products" },
        { status: 403 }
      );
    }

    // Delete files
    for (const image of product.images) {
      await deleteFile(image.url);
    }
    for (const video of product.videos) {
      await deleteFile(video.url);
    }
    if (product.certification?.certificateImages) {
      for (const cert of product.certification.certificateImages) {
        await deleteFile(cert.url);
      }
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Product Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
