const User = require("../models/User");

exports.getBuyerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "mobile role fullName addresses"
    );

    if (!user || user.role !== "buyer") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const plain = user.toObject();
    // Expose a single address field for the frontend, using the first saved address
    plain.address = (plain.addresses && plain.addresses[0]) || "";

    res.json(plain);
  } catch (err) {
    console.error("getBuyerProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateBuyerProfile = async (req, res) => {
  try {
    const { fullName, address } = req.body;

    const user = await User.findById(req.user._id);

    if (!user || user.role !== "buyer") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    console.log("updateBuyerProfile: Updating user", user._id, "with", { fullName, address });

    if (fullName) {
      user.fullName = fullName;
    }

    if (address) {
      if (!Array.isArray(user.addresses)) {
        user.addresses = [];
      }
      if (user.addresses.length === 0) {
        user.addresses.push(address);
      } else {
        user.addresses[0] = address;
      }
    }

    await user.save();
    console.log("updateBuyerProfile: User saved successfully");

    // Also update BuyerProfile (Sync with User)
    const BuyerProfile = require("../models/BuyerProfile");
    let buyerProfile = await BuyerProfile.findOne({ userId: req.user._id });

    if (!buyerProfile) {
      console.log("updateBuyerProfile: Creating new BuyerProfile sync doc");
      buyerProfile = new BuyerProfile({ userId: req.user._id });
    }

    if (fullName) {
      buyerProfile.fullName = fullName;
    }

    if (address) {
      if (buyerProfile.addresses && buyerProfile.addresses.length > 0) {
        buyerProfile.addresses[0].addressLine = address;
      } else {
        buyerProfile.addresses = [{
          label: "Home",
          addressLine: address,
          city: "", state: "", pincode: ""
        }];
      }
    }

    await buyerProfile.save();
    console.log("updateBuyerProfile: Linked BuyerProfile updated successfully:", buyerProfile._id);

    const plain = user.toObject();
    plain.address = (plain.addresses && plain.addresses[0]) || "";

    res.json(plain);
  } catch (err) {
    console.error("updateBuyerProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};