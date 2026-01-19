//configure nodemailer and send email verification mail
import nodemailer from "nodemailer";

export const sendVerificationEmail = async (
  email: string,
  verificationLink: string,
): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email Address",
    text: `Please verify your email by clicking on the following link: ${verificationLink}`,
  };

  await transporter.sendMail(mailOptions);
};
