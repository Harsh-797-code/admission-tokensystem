import IORedis from "ioredis";

const connection = new IORedis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,

  // Important for BullMQ workers
  maxRetriesPerRequest: null,
});

connection.on("connect", () => {
  console.log("Redis connected");
});

connection.on("error", (error) => {
  console.error("Redis connection error:", error);
});

export default connection;