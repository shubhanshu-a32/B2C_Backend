const mongoose = require("mongoose");

const deliveryPartnerSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true // One user can only have one partner profile
        },
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        mobile: {
            type: String,
            required: true
        },
        pincode: {
            type: String, // String to handle leading zeros if any, though numeric-like
            required: true,
            index: true // Indexed for faster filtering
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("DeliveryPartner", deliveryPartnerSchema);
