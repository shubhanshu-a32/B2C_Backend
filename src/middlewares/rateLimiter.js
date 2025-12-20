const rateLimit = require('express-rate-limit');

const createLimiter = (options = {}) => {
    return rateLimit({
        windowMs: options.windowMs || 1 * 60 * 1000, //1 Minute default
        max: options.max || 60,
        standardHeaders: true,
        legacyHeaders: false
    });
};

module.exports = createLimiter;