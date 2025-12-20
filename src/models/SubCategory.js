const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

subCategorySchema.index({ category: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model("SubCategory", subCategorySchema);
