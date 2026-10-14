import "dotenv/config";

import { Worker } from "bullmq";
import connection from "../config/redis.js";
import { EMAIL_QUEUE_NAME } from "../queues/email.queue.js";
import { sendEmail } from "../services/email.service.js";

const emailWorker = new Worker(
  EMAIL_QUEUE_NAME,
  async (job) => {
    console.log(`Processing email job ${job.id}`);

   const { to, subject, text, html } = job.data;

if (!to || !subject || (!text && !html)) {
  throw new Error(
    "Email job is missing required fields"
  );
}

    await sendEmail({
      to,
      subject,
      text,
      html,
    });

    console.log(`Email job ${job.id} completed`);
  },
  {
    connection,
    concurrency: 5,
  }
);

emailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

emailWorker.on("failed", (job, error) => {
  console.error(
    `Job ${job?.id} failed. Reason: ${error.message}`
  );
});

emailWorker.on("error", (error) => {
  console.error("Email worker error:", error);
});

console.log("Email worker is running...");

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down email worker...`);

  try {
    await emailWorker.close();
    console.log("Email worker closed");

    await connection.quit();
    console.log("Redis connection closed");

    process.exit(0);
  } catch (error) {
    console.error("Error during worker shutdown:", error);

    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));