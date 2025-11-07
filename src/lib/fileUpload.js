import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directory exists
const uploadDir = "./public/uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let subfolder = "products";

    if (file.fieldname === "licensePhotos") {
      subfolder = "licenses";
    } else if (file.fieldname === "videos") {
      subfolder = "videos";
    }

    const folderPath = path.join(uploadDir, subfolder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, "-");
    cb(null, name + "-" + uniqueSuffix + ext);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Check file types
  if (file.fieldname === "images" || file.fieldname === "licensePhotos") {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(
        new Error("Only image files are allowed for images and license photos"),
        false
      );
    }
  } else if (file.fieldname === "videos") {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed"), false);
    }
  } else {
    cb(new Error("Unexpected field"), false);
  }
};

// Configure multer
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  },
});

// Helper function to handle multiple file fields
export const uploadFields = upload.fields([
  { name: "images", maxCount: 10 },
  { name: "licensePhotos", maxCount: 5 },
  { name: "videos", maxCount: 3 },
]);

// Generate file URL
export function getFileUrl(filename, type = "products") {
  return `/uploads/${type}/${filename}`;
}

// Delete file
export function deleteFile(filepath) {
  const fullPath = path.join(process.cwd(), "public", filepath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    return true;
  }
  return false;
}
