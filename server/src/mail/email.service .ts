import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendVerificationEmail = async (
  email: string,
  code: string
) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your email",
    html: `
      <div>
        <h2>Email Verification</h2>

        <p>Thank you for registering.</p>

        <p>Your verification code is:</p>

        <h1>${code}</h1>

        <p>This code expires in 10 minutes.</p>

        <p>If you did not create this account, you can ignore this email.</p>
      </div>
    `,
  });
};