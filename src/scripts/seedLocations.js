const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const KatniLocation = require('../models/KatniLocation'); // Assuming this is the model
require('dotenv').config({ path: path.join(__dirname, '../../.env') }); // Adjust path to .env if needed

const seedLocations = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB for seeding.");

        const jsonPath = path.join(__dirname, '../../../katni_locations.json');
        const jsonData = fs.readFileSync(jsonPath, 'utf-8');
        const locations = JSON.parse(jsonData);

        console.log(`Found ${locations.length} locations to seed.`);

        // Upsert locations to avoid duplicates but ensure all exist
        for (const loc of locations) {
            await KatniLocation.updateOne(
                { area: loc.area },
                { $set: loc },
                { upsert: true }
            );
        }

        console.log("Seeding completed successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
};

seedLocations();
