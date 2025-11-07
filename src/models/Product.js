import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // အခြေခံအချက်အလက်များ
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      index: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
      index: true,
    },

    categoryName: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      index: true,
    },

    sku: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },

    // ပတ္တမြား၏ ပုံသဏ္ဍာန် (Shape)
    shape: {
      type: String,
      enum: {
        values: [
          "round",
          "oval",
          "cushion",
          "emerald",
          "pear",
          "marquise",
          "heart",
          "princess",
          "cabochon",
        ],
        message: "{VALUE} is not a valid shape",
      },
      required: [true, "Shape is required"],
      index: true,
    },

    // အလေးချိန် (Carat Weight)
    carat: {
      type: Number,
      required: [true, "Carat weight is required"],
      min: [0.01, "Carat must be at least 0.01"],
      index: true,
    },

    // အရောင် (Color)
    color: {
      grade: {
        type: String,
        enum: {
          values: [
            "pigeon-blood",
            "vivid-red",
            "deep-red",
            "medium-red",
            "pinkish-red",
            "purplish-red",
            "orangish-red",
          ],
          message: "{VALUE} is not a valid color grade",
        },
        required: [true, "Color grade is required"],
        index: true,
      },
      saturation: {
        type: String,
        enum: ["vivid", "strong", "medium", "weak", "pale"],
      },
      tone: {
        type: String,
        enum: ["light", "medium-light", "medium", "medium-dark", "dark"],
      },
      description: String,
    },

    // ကြည်လင်ပြတ်သားမှု (Clarity)
    clarity: {
      grade: {
        type: String,
        enum: {
          values: [
            "IF",
            "VVS1",
            "VVS2",
            "VS1",
            "VS2",
            "SI1",
            "SI2",
            "I1",
            "I2",
            "I3",
          ],
          message: "{VALUE} is not a valid clarity grade",
        },
        required: [true, "Clarity grade is required"],
        index: true,
      },
      eyeClean: { type: Boolean, default: false },
      description: String,
    },

    // ပြတ်စွမ်း (Cut Quality)
    cut: {
      grade: {
        type: String,
        enum: {
          values: ["excellent", "very-good", "good", "fair", "poor"],
          message: "{VALUE} is not a valid cut grade",
        },
        required: [true, "Cut grade is required"],
      },
      polish: String,
      symmetry: String,
      description: String,
    },

    // အတိုင်းအတာများ (Measurements)
    dimensions: {
      length: { type: Number, required: [true, "Length is required"] },
      width: { type: Number, required: [true, "Width is required"] },
      depth: { type: Number, required: [true, "Depth is required"] },
      ratio: Number,
    },

    // မူလဇာတိ (Origin)
    origin: {
      country: {
        type: String,
        required: [true, "Country of origin is required"],
        index: true,
        enum: {
          values: [
            "Myanmar (Burma)",
            "Mozambique",
            "Thailand",
            "Sri Lanka",
            "Madagascar",
            "Tanzania",
            "Vietnam",
            "Afghanistan",
            "Other",
          ],
          message: "{VALUE} is not a valid country",
        },
      },
      region: String,
      mine: String,
    },

    // အပူပေး/မပေး (Treatment)
    treatment: {
      heated: {
        type: Boolean,
        default: true,
        required: true,
      },
      treatmentType: {
        type: String,
        enum: {
          values: [
            "none",
            "heated",
            "heated-with-flux",
            "glass-filled",
            "diffused",
            "dyed",
          ],
          message: "{VALUE} is not a valid treatment type",
        },
        default: "heated",
      },
      description: String,
    },

    // လက်မှတ် (Certification)
    certification: {
      hasCertificate: { type: Boolean, default: false },
      lab: {
        type: String,
        enum: [
          "GRS",
          "GIA",
          "Gubelin",
          "AGL",
          "SSEF",
          "Lotus",
          "Other",
          "None",
        ],
      },
      certificateNumber: String,
      certificateDate: Date,
      certificateImages: [
        {
          url: String,
          filename: String,
          _id: false,
        },
      ],
    },

    // ကြယ်ပတ္တမြား (Star Rubies)
    phenomenonType: {
      type: String,
      enum: ["none", "star-6-ray", "star-12-ray", "cats-eye"],
      default: "none",
    },

    // ရုပ်ပုံများ (Images)
    images: [
      {
        url: { type: String, required: true },
        filename: String,
        alt: String,
        type: {
          type: String,
          enum: [
            "main",
            "daylight",
            "uv-light",
            "microscope",
            "video",
            "certificate",
          ],
        },
        isPrimary: { type: Boolean, default: false },
        order: { type: Number, default: 0 },
        _id: false,
      },
    ],

    // ဗီဒီယို (Videos)
    videos: [
      {
        url: String,
        thumbnail: String,
        description: String,
        duration: Number,
        _id: false,
      },
    ],

    // ဈေးနှုန်း (Pricing)
    price: {
      amount: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price must be positive"],
      },
      currency: {
        type: String,
        enum: ["USD", "MMK", "THB"],
        default: "USD",
      },
      pricePerCarat: Number,
      compareAtPrice: Number,
    },

    // ဝယ်ချိန် ငွေလဲနှုန်း (Buying Rate)
    buyingCurrencyRateToMMK: {
      type: Number,
      min: 0,
    },

    // ရှိ/မရှိ (Availability Status)
    status: {
      type: String,
      enum: {
        values: [
          "available",
          "reserved",
          "sold",
          "on-hold",
          "pending",
          "archived",
        ],
        message: "{VALUE} is not a valid status",
      },
      default: "pending",
      index: true,
    },

    // သိမ်းထားခြင်း (Reservation)
    reservation: {
      reservedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      reservedAt: Date,
      reservedUntil: Date,
      cartId: String,
    },

    // အထူးအချက်အလက်များ (Features)
    features: {
      eyeClean: Boolean,
      unheated: Boolean,
      pigeonBlood: Boolean,
      neonEffect: Boolean,
      glowEffect: Boolean,
      certified: Boolean,
      burmeseOrigin: Boolean,
    },

    // Tags
    tags: {
      type: [String],
      default: [],
    },

    // SEO
    metaTitle: String,
    metaDescription: String,

    // ရှင်းလင်းချက် (Description)
    description: {
      short: {
        type: String,
        maxlength: [200, "Short description cannot exceed 200 characters"],
      },
      full: String,
    },

    // စိစစ်ခြင်း (Moderation)
    moderation: {
      status: {
        type: String,
        enum: ["pending", "approved", "rejected", "needs-revision"],
        default: "pending",
      },
      approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      approvedAt: Date,
      rejectionReason: String,
      internalNotes: String,
    },

    // တင်သူ (Created By)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },

    // အထူး (Featured)
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    featuredOrder: Number,

    // စာရင်း (Statistics)
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strictPopulate: false, // Add this line
  }
);

// ============================================
// INDEXES
// ============================================

// Text search
productSchema.index({
  name: "text",
  "description.full": "text",
  tags: "text",
});

// Compound indexes for filtering
productSchema.index({
  "moderation.status": 1,
  status: 1,
  "color.grade": 1,
  carat: 1,
  "price.amount": 1,
});

productSchema.index({
  "moderation.status": 1,
  status: 1,
  "origin.country": 1,
  "treatment.heated": 1,
});

productSchema.index({
  featured: 1,
  featuredOrder: 1,
  "moderation.status": 1,
});

// Category index
productSchema.index({
  category: 1,
  "moderation.status": 1,
  status: 1,
});

// ============================================
// VIRTUALS
// ============================================

productSchema.virtual("url").get(function () {
  return `/products/${this.slug}`;
});

productSchema.virtual("pricePerCaratCalculated").get(function () {
  if (this.price?.amount && this.carat) {
    return Math.round((this.price.amount / this.carat) * 100) / 100;
  }
  return 0;
});

// ============================================
// METHODS
// ============================================

// Check if ruby is premium quality
productSchema.methods.isPremium = function () {
  return (
    this.features?.unheated &&
    this.origin?.country === "Myanmar (Burma)" &&
    ["pigeon-blood", "vivid-red"].includes(this.color?.grade) &&
    ["IF", "VVS1", "VVS2", "VS1"].includes(this.clarity?.grade)
  );
};

// Reserve ruby for cart
productSchema.methods.reserve = async function (userId, cartId, minutes = 30) {
  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + minutes);

  this.status = "reserved";
  this.reservation = {
    reservedBy: userId,
    reservedAt: new Date(),
    reservedUntil: expiryTime,
    cartId: cartId,
  };

  return await this.save();
};

// Release reservation
productSchema.methods.releaseReservation = async function () {
  this.status = "available";
  this.reservation = undefined;
  return await this.save();
};

// Approve product
productSchema.methods.approve = async function (approvedBy) {
  this.moderation.status = "approved";
  this.moderation.approvedBy = approvedBy;
  this.moderation.approvedAt = new Date();
  this.status = "available"; // Auto set to available when approved
  return await this.save();
};

// Reject product
productSchema.methods.reject = async function (rejectedBy, reason) {
  this.moderation.status = "rejected";
  this.moderation.approvedBy = rejectedBy;
  this.moderation.approvedAt = new Date();
  this.moderation.rejectionReason = reason;
  this.status = "archived"; // Archive rejected products
  return await this.save();
};

// ============================================
// STATICS
// ============================================

// Find available products with filters
productSchema.statics.findAvailable = function (filters = {}) {
  const query = {
    status: "available",
    "moderation.status": "approved",
  };

  if (filters.shape) query.shape = filters.shape;
  if (filters.minCarat) query.carat = { $gte: filters.minCarat };
  if (filters.maxCarat)
    query.carat = { ...query.carat, $lte: filters.maxCarat };
  if (filters.color) query["color.grade"] = filters.color;
  if (filters.origin) query["origin.country"] = filters.origin;
  if (filters.category) query.category = filters.category;
  if (filters.unheated === true) query["treatment.heated"] = false;
  if (filters.minPrice) query["price.amount"] = { $gte: filters.minPrice };
  if (filters.maxPrice)
    query["price.amount"] = {
      ...query["price.amount"],
      $lte: filters.maxPrice,
    };

  return this.find(query);
};

// Find pending products (for admin approval)
productSchema.statics.findPending = function () {
  return this.find({
    "moderation.status": "pending",
  })
    .populate({
      path: "category",
      select: "name slug",
    })
    .populate({
      path: "createdBy",
      select: "name email",
    })
    .sort({ createdAt: -1 });
};

// ============================================
// MIDDLEWARE
// ============================================

// Pre-save: Generate SKU if not exists
productSchema.pre("save", function (next) {
  // Generate SKU
  if (!this.sku) {
    this.sku = `RBY-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 5)
      .toUpperCase()}`;
  }

  // Calculate price per carat
  if (this.price?.amount && this.carat) {
    this.price.pricePerCarat =
      Math.round((this.price.amount / this.carat) * 100) / 100;
  }

  // Calculate dimension ratio
  if (this.dimensions?.length && this.dimensions?.width) {
    this.dimensions.ratio =
      Math.round((this.dimensions.length / this.dimensions.width) * 100) / 100;
  }

  // Auto-set features based on data
  if (!this.features) this.features = {};

  this.features.unheated = this.treatment?.heated === false;
  this.features.pigeonBlood = this.color?.grade === "pigeon-blood";
  this.features.certified = this.certification?.hasCertificate === true;
  this.features.burmeseOrigin = this.origin?.country === "Myanmar (Burma)";
  this.features.eyeClean = this.clarity?.eyeClean === true;

  next();
});

// Pre-save: Auto-release expired reservations
productSchema.pre("save", function (next) {
  if (
    this.status === "reserved" &&
    this.reservation?.reservedUntil &&
    new Date() > this.reservation.reservedUntil
  ) {
    this.status = "available";
    this.reservation = undefined;
  }
  next();
});

// Export
export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
