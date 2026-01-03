const mongoose = require('mongoose');
const Order = require('./src/models/Order');
require('dotenv').config();

const getOrderId = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const order = await Order.findOne();
        if (order) {
            console.log(`ORDER_ID:${order._id}`);
        } else {
            console.log('NO_ORDERS_FOUND');
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

getOrderId();
