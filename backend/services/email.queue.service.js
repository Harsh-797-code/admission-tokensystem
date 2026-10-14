import { emailQueue } from "../queues/email.queue.js";

export async function queueEmail({
  to,
  subject,
  text = "",
  html = "",
}) {
  if (!to) {
    throw new Error("Email recipient is required");
  }

  if (!subject) {
    throw new Error("Email subject is required");
  }

  if (!text && !html) {
    throw new Error(
      "Email must contain either text or HTML content"
    );
  }

  const job = await emailQueue.add(
    "send-email",
    {
      to,
      subject,
      text,
      html,
    },
    {
      jobId: `email-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`,
    }
  );

  console.log(`Email queued successfully. Job ID: ${job.id}`);

  return {
    jobId: job.id,
  };
}