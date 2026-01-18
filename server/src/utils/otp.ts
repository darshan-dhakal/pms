import crypto from "crypto";
import nodemailer from "nodemailer";

export const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

export const hashOTP = (otp: string): string => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

export const verifyOTP = (plainOTP: string, hashedOTP: string): boolean => {
  const hash = crypto.createHash("sha256").update(plainOTP).digest("hex");
  return hash === hashedOTP;
};

export const sendOTPEmail = async (
  email: string,
  otp: string,
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
    subject: "Your Login OTP",
    text: `Your OTP for login is: ${otp}. It is valid for 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};
