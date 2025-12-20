const mongoose = require("mongoose");

const onlineOrderSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },

    paymentGateway: {
      type: String,
      enum: ["RAZORPAY", "STRIPE"],
      required: true,
    },

    transactionId: {
      type: String,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["SUCCESS", "FAILED", "PENDING"],
      default: "PENDING",
    },

    paidAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("OnlineOrder", onlineOrderSchema);
