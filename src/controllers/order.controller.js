const Order = require("../models/Order");
const Product = require("../models/Product");

/* ---------------- CREATE ORDER ---------------- */
const createOrder = async (req, res) => {
  try {
    const buyer = req.user._id;
    // Accept both paymentMode and paymentType (frontend uses paymentType)
    const paymentMode = req.body.paymentMode || req.body.paymentType || "COD";
    const { items, address } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items required" });
    }

    let totalAmount = 0;
    let seller = null;

    const orderItems = [];

    for (const it of items) {
      const prodId = it.product || it.productId;
      const qty = it.quantity || it.qty;

      const product = await Product.findById(prodId);

      if (!product) {
        return res.status(400).json({ message: "Product not found" });
      }

      if (product.stock < qty) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.title}`,
        });
      }

      if (!seller) seller = product.sellerId;
      if (seller.toString() !== product.sellerId.toString()) {
        return res
          .status(400)
          .json({ message: "Multiple sellers in one order not allowed" });
      }

      totalAmount += product.price * qty;

      orderItems.push({
        product: product._id,
        quantity: qty,
        price: product.price,
      });
    }

    const order = await Order.create({
      buyer,
      sellerId: seller,
      items: orderItems,
      totalAmount,
      paymentMode,
      paymentStatus: paymentMode === "COD" ? "PENDING" : "PAID",
      orderStatus: "PLACED",
      address,
    });

    // Reduce stock AFTER order success
    for (const it of orderItems) {
      await Product.findByIdAndUpdate(it.product, {
        $inc: { stock: -it.quantity },
      });
    }

    res.status(201).json(order);
  } catch (err) {
    console.error("createOrder error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- LIST ORDERS ---------------- */
const listOrdersByUser = async (req, res) => {
  try {
    const user = req.user;
    const { page = 1, limit = 10 } = req.query;

    const filter =
      user.role === "buyer"
        ? { buyer: user._id }
        : { "items.product": { $exists: true } };

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .limit(Number(limit))
      .populate("items.product")
      .populate("buyer", "fullName mobile email addresses");

    res.json({ data: orders });
  } catch (err) {
    console.error("listOrders error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- UPDATE STATUS ---------------- */
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (req.user.role === "seller") {
      order.orderStatus = status;
      await order.save();
      return res.json(order);
    }

    if (
      req.user.role === "buyer" &&
      status === "CANCELLED" &&
      order.orderStatus === "PLACED"
    ) {
      order.orderStatus = "CANCELLED";
      await order.save();
      return res.json(order);
    }

    res.status(403).json({ message: "Not authorized" });
  } catch (err) {
    console.error("updateOrderStatus error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createOrder,
  listOrdersByUser,
  updateOrderStatus,
};
