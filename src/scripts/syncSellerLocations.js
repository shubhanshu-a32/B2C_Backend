const mongoose = require('mongoose');
const path = require('path');
const User = require('../models/User');
const SellerProfile = require('../models/SellerProfile');
const KatniLocation = require('../models/KatniLocation');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const syncLocations = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB for syncing.");

        // fetch all known locations for matching
        const knownLocations = await KatniLocation.find();
        console.log(`Loaded ${knownLocations.length} known locations.`);

        const sellers = await User.find({ role: 'seller' });
        console.log(`Found ${sellers.length} sellers to check.`);

        let updatedCount = 0;

        for (const seller of sellers) {
            let matchedArea = null;
            let matchedPincode = null;

            // Try to match address string against known locations
            if (seller.address) {
                const lowerAddr = seller.address.toLowerCase();

                // 1. Find Pincode in address
                const pinMatch = seller.address.match(/\b48\d{4}\b/); // Matches 48xxxx like 483501
                if (pinMatch) {
                    matchedPincode = Number(pinMatch[0]);
                }

                // 2. Find Area in address
                // Sort known locations by length desc to match "Ram Nagar" before "Ram" if both exist (greedy)
                const sortedLocs = knownLocations.sort((a, b) => b.area.length - a.area.length);

                for (const loc of sortedLocs) {
                    if (lowerAddr.includes(loc.area.toLowerCase())) {
                        matchedArea = loc.area;
                        // If we didn't find pincode from text, use the one from known location
                        if (!matchedPincode) matchedPincode = loc.pincode;
                        break;
                    }
                }
            }

            // Sync to SellerProfile
            if (matchedArea || matchedPincode) {
                console.log(`Seller ${seller.shopName || seller.fullName}: Matched Area=${matchedArea}, Pin=${matchedPincode}`);

                const update = {};
                if (matchedPincode) update.pincode = matchedPincode;
                if (matchedArea) update.area = matchedArea;

                // ensure base fields exist too
                update.userId = seller._id;
                update.shopName = seller.shopName || seller.fullName;
                update.businessPhone = seller.mobile;
                update.address = seller.address;

                await SellerProfile.findOneAndUpdate(
                    { userId: seller._id },
                    { $set: update },
                    { upsert: true, new: true }
                );
                updatedCount++;
            } else {
                console.log(`Seller ${seller.shopName || seller.fullName}: No location match found in address: "${seller.address}"`);
            }
        }

        console.log(`Sync completed. Updated ${updatedCount} profiles.`);
        process.exit(0);
    } catch (err) {
        console.error("Sync failed:", err);
        process.exit(1);
    }
};

syncLocations();
