// const redis = require("redis");
const Redis = require("ioredis");
// const client = redis.createClient();
const client = new Redis();
// client.on("connect",() =>{
//     console.log("redis connected");
// })

const RedisService={

    get:async (key)=>{
        // await client.connect();
        const result = await client.get(key);
        // await client.disconnect();
        return result;
    },
    // set: async ({ key, value , timeType, time}) =>{
    set: async ({ key, value }) =>{
        // await client.connect();
        // await client.set(key, value, timeType, time);
        await client.set(key, value);
        // await client.disconnect();
      }
}
module.exports = RedisService;