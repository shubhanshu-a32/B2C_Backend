const {createClient} = require('redis');

const createRedisClient = (redisUrl) => {
    if(!redisUrl) return null;
    const client = createClient({url: redisUrl });
    client.on('error', (err) => console.log('❌ Redis Client Error', err));
    return client;
};

module.exports = { createRedisClient };