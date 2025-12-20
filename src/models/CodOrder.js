const mongoose = require("mongoose");

const codOrderSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID"],
      default: "PENDING",
    },

    collectedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("CodOrder", codOrderSchema);