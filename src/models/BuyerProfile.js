const mongoose = require('mongoose');

const buyerProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    fullName: { type: String },
    email: { type: String },
    addresses: [
        {
            label: String,
            addressLine: String,
            city: String,
            state: String,
            pincode: String
        }
    ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BuyerProfile', buyerProfileSchema);