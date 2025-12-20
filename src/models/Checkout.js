const mongoose = require("mongoose");

const checkoutSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
      },
    ],

    totalAmount: Number,

    address: {
      fullAddress: String,
      lat: Number,
      lng: Number,
    },

    expiresAt: {
      type: Date,
      default: () => Date.now() + 15 * 60 * 1000,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Checkout", checkoutSchema);