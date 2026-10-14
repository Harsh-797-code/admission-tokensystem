export function createAdmissionEmail({
  studentName,
  bookingLink,
}) {
  if (!studentName) {
    throw new Error("Student name is required");
  }

  if (!bookingLink) {
    throw new Error("Booking link is required");
  }

  const subject = "Admission Slot Booking - Action Required";

  const text = `
Hello ${studentName},

Congratulations! You have been invited to continue the admission process.

Please use the secure link below to select and confirm your admission slot:

${bookingLink}

IMPORTANT:
- This link is unique to you.
- Do not share this link with anyone.
- The link can be used only once.
- Once you confirm your admission slot, the link will no longer work.

If you did not expect this email, please contact the college admission office.

Regards,
Admission Office
`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>

<body style="
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
">
  <div style="
    max-width: 600px;
    margin: 30px auto;
    background: #ffffff;
    border-radius: 10px;
    overflow: hidden;
  ">

    <div style="
      padding: 25px;
      text-align: center;
      background: #1f2937;
      color: white;
    ">
      <h1 style="margin: 0;">
        Admission Portal
      </h1>
    </div>

    <div style="
      padding: 30px;
      color: #333333;
      line-height: 1.6;
    ">
      <h2>Hello ${studentName},</h2>

      <p>
        Congratulations! You have been invited to continue
        the admission process.
      </p>

      <p>
        Please use the secure button below to select and
        confirm your admission slot.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a
          href="${bookingLink}"
          style="
            display: inline-block;
            padding: 14px 24px;
            background: #2563eb;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
          "
        >
          Select Admission Slot
        </a>
      </div>

      <p>
        <strong>Important:</strong>
      </p>

      <ul>
        <li>This link is unique to you.</li>
        <li>Do not share this link with anyone.</li>
        <li>The link can be used only once.</li>
        <li>
          Once your slot is confirmed, the link will no
          longer work.
        </li>
      </ul>

      <p>
        If you did not expect this email, please contact
        the college admission office.
      </p>

      <br />

      <p>
        Regards,<br />
        <strong>Admission Office</strong>
      </p>
    </div>

  </div>
</body>
</html>
`;

  return {
    subject,
    text,
    html,
  };
}