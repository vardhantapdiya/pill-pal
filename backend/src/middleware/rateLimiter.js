const redisClient = require("../utils/redisClient"); // your existing Upstash client

const rateLimiter = ({
    keyPrefix,
    capacity,
    refillRate, // tokens per second
    identifyBy = "auto", // "ip" | "user" | "auto"
}) => {
    return async (req, res, next) => {
        try {
            let identifier;

            if (identifyBy === "user") {
                identifier = req.user?.id;
                if (!identifier) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
            } else if (identifyBy === "ip") {
                identifier = req.ip;
            } else {
                identifier = req.user?.id || req.ip;
            }

            const key = `${keyPrefix}:${identifier}`;
            const now = Date.now();

            const luaScript = `
        local key = KEYS[1]
        local capacity = tonumber(ARGV[1])
        local refillRate = tonumber(ARGV[2])
        local now = tonumber(ARGV[3])

        local data = redis.call("HMGET", key, "tokens", "lastRefill")
        local tokens = tonumber(data[1])
        local lastRefill = tonumber(data[2])

        if tokens == nil then
          tokens = capacity
          lastRefill = now
        end

        local delta = math.max(0, now - lastRefill)
        local refill = (delta / 1000) * refillRate
        tokens = math.min(capacity, tokens + refill)

        if tokens < 1 then
          return -1
        end

        tokens = tokens - 1

        redis.call("HMSET", key, "tokens", tokens, "lastRefill", now)
        redis.call("PEXPIRE", key, 60000)

        return tokens
      `;

            const result = await redisClient.eval(luaScript, { //different in original redis, but this one for upstash
                keys: [String(key)],
                arguments: [
                    String(capacity),
                    String(refillRate),
                    String(now),
                ],
            });

            if (result === -1) {
                console.log("Rate Limiting Block for request number reaching more than the set limit")
                return res.status(429).json({
                    success: false,
                    message: "Too many requests. Please try again later.",
                });
            }

            next();
        } catch (err) {
            console.error("Rate limiter error:", err);
            next(); // fail-open (important for prod)
        }
    };
};

module.exports = rateLimiter;