const {createRedisClient} = require('../config/redis');
const redisUrl = process.env.REDIS_URL;

const ttlSeconds = 5 * 60;

let redisClient = null;
if(redisUrl) {
    redisClient = createRedisClient(redisUrl);
    (async () => {
        try {
            await redisClient.connect();
            console.log('🚀 Redis connected for OTP storage')
        } catch(err) {
            console.warn('Could not connect to Redis, falling back to memory store', err);
            redisClient = null;
        }
    }) ();
};

const memoryStore = new Map();

const setOtp = async (mobile, otp) => {
    if(redisClient) {
        await redisClient.setEx(`otp:${mobile}`, ttlSeconds, otp);
    } else {
        memoryStore.set(mobile, {otp, expiresAt: Date.now() + ttlSeconds * 1000 });
    }
};

const getOtp = async (mobile) => {
    if(redisClient) {
        const v = await redisClient.get(`otp:${mobile}`);
        return v;
    } else {
        const rec = memoryStore.get(mobile);
        if(!rec) return null;
        if(Date.now() > rec.expiresAt) {
            memoryStore.delete(mobile);
            return null;
        }
        return rec.otp;
    }
};

const deleteOtp = async (mobile) => {
    if(redisClient) {
        await redisClient.del(`otp:${mobile}`);
    } else {
        memoryStore.delete(mobile);
    }
};

module.exports = { setOtp, getOtp, deleteOtp, ttlSeconds };