const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/auth");
const { getBuyerProfile, updateBuyerProfile } = require("../controllers/buyerProfile.controller");

router.get("/", authenticate, getBuyerProfile);
router.put("/", authenticate, updateBuyerProfile);

module.exports = router;