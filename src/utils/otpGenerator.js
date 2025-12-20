const {v4: uuidv4} = require('uuid');

const generateNumericOtp = (length = 6) => {
    let otp = '';
    for(let i = 0; i < length; i++) otp += Math.floor(Math.random() * 10);
    return otp;
};

module.exports = { generateNumericOtp };