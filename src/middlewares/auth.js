const jwt = require('jsonwebtoken');
const User = require('../models/User');

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'change_me';

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.log("Auth Middleware: Authorization header missing");
        return res.status(401).json({ message: 'Authorization header missing' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        console.log("Auth Middleware: Token missing from header");
        return res.status(401).json({ message: 'Token missing' });
    }

    try {
        const payload = jwt.verify(token, ACCESS_SECRET);

        // Handle payload differences (id vs userId)
        const userId = payload.userId || payload.id;
        const role = payload.role;

        let user = null;

        if (role === 'admin') {
            const Admin = require('../models/Admin');
            user = await Admin.findById(userId).select('-password -__v');
        } else {
            user = await User.findById(userId).select('-__v');
        }

        if (!user) {
            console.log("Auth Middleware: User/Admin not found for ID:", userId);
            return res.status(401).json({ message: 'Invalid token (user not found)' });
        }

        // Ensure role is set on user object if not present (Admin model has default)
        if (!user.role && role) user.role = role;

        req.user = user;
        next();
    } catch (err) {
        console.log("Auth Middleware: Token verification failed:", err.message);
        return res.status(401).json({ message: 'Token invalid or expired', error: err.message });
    }
};

module.exports = authenticate;