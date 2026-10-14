

import db from "../db.js";
import { generateToken, hashToken } from "../utils/token.js";
import { createAdmissionEmail } from "../templates/admission-email.template.js";
import { queueEmail } from "../services/email.queue.service.js";

export async function createStudent(req, res) {
  try {
    const {
      keaRegistrationNo,
      name,
      email,
      phone,
    } = req.body;

    // Basic validation
    if (!keaRegistrationNo || !name || !email || !phone) {
      return res.status(400).json({
        status: "error",
        message:
          "keaRegistrationNo, name, email and phone are required",
      });
    }

    // Generate a cryptographically secure raw token
    const rawToken = generateToken();

    // Store only the SHA-256 hash in the database
    const tokenHash = hashToken(rawToken);

    // Token valid for 7 days
    const tokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    // Save student
    const result = await db.query(
      `
      INSERT INTO students (
        kea_registration_no,
        name,
        email,
        phone,
        token_hash,
        token_expires_at,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'PENDING')
      RETURNING
        id,
        kea_registration_no,
        name,
        email,
        phone,
        status,
        token_expires_at
      `,
      [
        keaRegistrationNo.trim(),
        name.trim(),
        email.trim().toLowerCase(),
        phone.trim(),
        tokenHash,
        tokenExpiresAt,
      ]
    );

    const student = result.rows[0];

    // Create secure booking link
    const bookingLink =
      `${process.env.APP_URL}/api/students/booking` +
      `?token=${encodeURIComponent(rawToken)}`;

    // Generate personalized email
    const emailContent = createAdmissionEmail({
      studentName: student.name,
      bookingLink,
    });

    // Add email to BullMQ
    const emailJob = await queueEmail({
      to: student.email,
      ...emailContent,
    });

    // Update status after successfully queueing email
    await db.query(
      `
      UPDATE students
      SET status = 'EMAIL_SENT',
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      `,
      [student.id]
    );

    return res.status(201).json({
      status: "success",
      message: "Student created and admission email queued successfully",
      student: {
        ...student,
        status: "EMAIL_SENT",
      },
      emailJobId: emailJob.jobId,
    });
  } catch (error) {
    console.error("Create student error:", error);

    // PostgreSQL unique constraint violation
    if (error.code === "23505") {
      return res.status(409).json({
        status: "error",
        message:
          "A student with this KEA registration number already exists",
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Failed to create student",
    });
  }
}