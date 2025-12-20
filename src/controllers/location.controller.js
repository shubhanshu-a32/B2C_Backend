const axios = require("axios");

exports.reverseGeocode = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_KEY}`;

    const result = await axios.get(url);

    if (!result.data.results.length) {
      console.log("Location Controller: No results found for", lat, lng, "Status:", result.data.status);
      return res.status(400).json({ message: "Address not found" });
    }

    const address = result.data.results[0].formatted_address;

    res.json({ address });
  } catch (err) {
    console.error("Reverse geocode error:", err);
    res.status(500).json({ message: "Reverse geocoding failed" });
  }
};