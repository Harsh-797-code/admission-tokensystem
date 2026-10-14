import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({ to, subject, text, html }) {
  const info = await transporter.sendMail({
    from: `"Admission Token System" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  });

  console.log("Email sent:", info.messageId);

  return info;
}

export async function verifyEmailConnection() {
  await transporter.verify();
  console.log("Gmail SMTP connection verified");
}

export default transporter;