const app = require('./server');
// const redis = require("redis");
 
// const blackListedRedisClient = redis.createClient();
// // blackListedRedisClient.connect();
// blackListedRedisClient.on('connect', () => {
//     console.log(`redis running on : localhost`)
// });

// blackListedRedisClient.on('error', (error) => {
//     console.log(error)
// });
// RedisClient.on('connect', () => {
//     console.log(`redis running on : localhost`)
//   })
//   RedisClient.on('error', (error) => {
//     console.log(error)
//   })
app.start();

// module.exports = blackListedRedisClient;
