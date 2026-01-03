const { createClient } = require("redis");

const redisClient = createClient({
    url:process.env.REDIS_URL
})

redisClient.on('error',(err)=>{
  console.error("Redis Client Error:",err);
})

redisClient.on('reconnecting', () => {
    console.log("Redis reconnecting...");
});

async function connectRedis() {
  try {
    await redisClient.connect();
    console.log("✅ Connected to Upstash Redis");
  } catch (err) {
    console.error("❌ Redis connection failed:", err);
  }
}

connectRedis();

module.exports = redisClient;