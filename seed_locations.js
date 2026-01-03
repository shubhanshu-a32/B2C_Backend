const mongoose = require('mongoose');
const KatniLocation = require('./src/models/KatniLocation');
require('dotenv').config(); // Load env for Mongo URI

const locations = [
    // 483501 (Central Katni / Old City Areas)
    ...["Ghantaghar", "Nehru Market", "Gole Bazar", "Subhash Chowk", "Juniani", "Barahi", "Bhatta Mohalla", "Purani Basti", "Civil Lines", "Bus Stand Area", "Katangi Road", "Railway Station Area"]
        .map(area => ({ area, pincode: 483501 })),

    // 483504 (Katni Junction / Railway Side)
    ...["Katni Junction", "Madan Mahal", "Tilak Nagar", "Jawahar Nagar", "Gandhi Nagar", "Indira Colony", "Shivaji Nagar", "Madhav Nagar", "Saraswati Nagar"]
        .map(area => ({ area, pincode: 483504 })),

    // 483503 (Katni South / New & Residential Colonies)
    ...["New Katni", "Vijay Nagar", "Palasia", "Shanti Nagar", "Durga Colony", "Ram Manohar Lohia Nagar", "Krishna Nagar", "Sanjay Gandhi Nagar", "Azad Nagar", "Vivekanand Nagar", "Patel Nagar", "Rani Durgavati Nagar", "Laxmi Nagar", "Ambedkar Nagar", "New Ram Nagar", "Hanuman Nagar", "Gayatri Nagar", "Balaji Nagar", "Nayagaon"]
        .map(area => ({ area, pincode: 483503 }))
];

const seed = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/b2c_marketplace");
        console.log("Connected to DB");

        // Clear existing locations as requested
        console.log("Deleting old locations...");
        await KatniLocation.deleteMany({});

        console.log("Seeding new locations...");
        for (const loc of locations) {
            await KatniLocation.create({ ...loc, district: "Katni", state: "Madhya Pradesh" });
        }

        console.log(`Successfully seeded ${locations.length} locations`);
        process.exit(0);
    } catch (err) {
        console.error("Seed Error:", err);
        process.exit(1);
    }
};

seed();
