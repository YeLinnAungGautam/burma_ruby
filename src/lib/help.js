import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function saveImage(file) {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "categories"
    );
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name.replace(/\s/g, "-")}`;
    const filepath = path.join(uploadDir, filename);

    // Save file
    await writeFile(filepath, buffer);

    return {
      url: `/uploads/categories/${filename}`,
      filename: filename,
      alt: file.name.split(".")[0],
      size: file.size,
      mimetype: file.type,
    };
  } catch (error) {
    console.error("Error saving image:", error);
    throw new Error("Failed to save image");
  }
}

export async function saveFile(file, folder = "products") {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name.replace(/\s/g, "-")}`;
    const filepath = path.join(uploadDir, filename);

    // Save file
    await writeFile(filepath, buffer);

    return {
      url: `/uploads/${folder}/${filename}`,
      filename: filename,
      alt: file.name.split(".")[0],
      size: file.size,
      mimetype: file.type,
    };
  } catch (error) {
    console.error("Error saving file:", error);
    throw new Error("Failed to save file");
  }
}

export async function deleteFile(filepath) {
  const fullPath = path.join(process.cwd(), "public", filepath);
  if (existsSync(fullPath)) {
    await unlink(fullPath);
    return true;
  }
  return false;
}
