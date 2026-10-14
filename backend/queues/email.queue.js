import { Queue } from "bullmq";
import connection from "../config/redis.js";

export const EMAIL_QUEUE_NAME = "email";

export const emailQueue = new Queue(EMAIL_QUEUE_NAME, {
  connection,

  defaultJobOptions: {
    attempts: 5,

    backoff: {
      type: "exponential",
      delay: 5000,
    },

    removeOnComplete: {
      age: 24 * 60 * 60,
      count: 1000,
    },

    removeOnFail: {
      age: 7 * 24 * 60 * 60,
      count: 5000,
    },
  },
});