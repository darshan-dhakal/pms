import { token } from "morgan";
import { AppDataSource } from "../config/datasource";
import { User } from "../entities/user.entity";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import { generateToken, hashToken } from "../utils/token";
import jwt from "jsonwebtoken";
import type { Secret } from "jsonwebtoken";
import { generateJWT } from "../utils/jwt";
import { generateOTP, hashOTP, verifyOTP, sendOTPEmail } from "../utils/otp";
import { sendVerificationEmail } from "../utils/verify-email";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

export class AuthService {
  private userRepo = AppDataSource.getRepository(User);

  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    const existing = await this.userRepo.findOne({
      where: { email: data.email },
    });
    if (existing) {
      throw new Error("User already exists");
    }
    const hashedPassword = await hashPassword(data.password);

    // Generate email verification token
    const emailVerificationToken = generateToken(32);
    const hashedEmailToken = hashToken(emailVerificationToken);
    const emailVerificationExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    ); // 24 hours from now

    const user = this.userRepo.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
      emailVerificationToken: hashedEmailToken,
      emailVerificationTokenExpiresAt: emailVerificationExpiresAt,
    });
    await this.userRepo.save(user);

    // TODO: Send email with verification link
    // Example: sendEmail(user.email, `http://localhost:3000/api/verify-email?token=${emailVerificationToken}`)

    await sendVerificationEmail(
      user.email,
      `http://localhost:3000/api/verify-email?token=${emailVerificationToken}`,
    );

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      message: "Please check your email to verify your account",
      // For testing only - remove in production:
      emailVerificationToken: emailVerificationToken,
    };
  }

  async verifyEmail(token: string) {
    // Hash the incoming token to compare with stored hash
    const hashedToken = hashToken(token);

    // Find user with this token
    const user = await this.userRepo
      .createQueryBuilder("user")
      .addSelect("user.emailVerificationToken")
      .addSelect("user.emailVerificationTokenExpiresAt")
      .where("user.emailVerificationToken = :token", { token: hashedToken })
      .getOne();

    if (!user) {
      throw new Error("Invalid verification token");
    }

    // Check if token has expired
    if (
      user.emailVerificationTokenExpiresAt &&
      user.emailVerificationTokenExpiresAt < new Date()
    ) {
      throw new Error("Verification token has expired");
    }

    // Update user as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpiresAt = null;
    await this.userRepo.save(user);

    return { message: "Email verified successfully" };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.userRepo.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.isEmailVerified) {
      throw new Error("Email already verified");
    }

    // Generate new email verification token
    const emailVerificationToken = generateToken(32);
    const hashedEmailToken = hashToken(emailVerificationToken);
    const emailVerificationExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    ); // 24 hours from now

    // Update user with new token
    await sendVerificationEmail(
      user.email,
      `http://localhost:3000/verify-email?token=${emailVerificationToken}`,
    );

    return {
      message: "Verification email sent successfully",
      // For testing only - remove in production:
      emailVerificationToken: emailVerificationToken,
    };
  }

  async loginUser(email: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      select: [
        "id",
        "firstName",
        "lastName",
        "email",
        "password",
        "isEmailVerified",
        "role",
      ],
    });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
    return await this.sendLoginOTP(email, !user.isEmailVerified);
  }

  //   const token = generateJWT({
  //     id: user.id,
  //     email: user.email,
  //     role: user.role,
  //   });

  //   return {
  //     token,
  //     user: {
  //       id: user.id,
  //       firstName: user.firstName,
  //       lastName: user.lastName,
  //       email: user.email,
  //       role: user.role,
  //     },
  //     message: "Login successful",
  //   };
  // }

  async sendLoginOTP(email: string, emailNotVerified: boolean = false) {
    const user = await this.userRepo.findOne({
      where: { email },
      select: [
        "id",
        "firstName",
        "lastName",
        "email",
        "isEmailVerified",
        "role",
      ],
    });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Generate OTP
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    user.loginOtp = hashedOTP;
    user.loginOtpExpiresAt = otpExpiresAt;
    await this.userRepo.save(user);

    // Send OTP via email
    try {
      await sendOTPEmail(user.email, otp);
    } catch (error) {
      console.error("Error sending OTP email:", error);
      throw new Error("Failed to send OTP email");
    }
    return {
      message: "OTP sent to email successfully",
      expiresAt: 300,
      emailNotVerified: emailNotVerified,
    };
  }

  async verifyLoginOTP(email: string, otp: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      select: [
        "id",
        "firstName",
        "lastName",
        "email",
        "loginOtp",
        "loginOtpExpiresAt",
        "isEmailVerified",
        "role",
      ],
    });
    if (!user) {
      throw new Error("Invalid email or OTP");
    }
    if (!user.loginOtp) {
      throw new Error("No OTP found. Please request a new one.");
    }
    // Check if OTP has expired
    if (user.loginOtpExpiresAt && user.loginOtpExpiresAt < new Date()) {
      throw new Error("OTP has expired");
    }

    if (!verifyOTP(otp, user.loginOtp)) {
      throw new Error("Invalid OTP");
    }

    // Clear OTP fields
    user.loginOtp = null;
    user.loginOtpExpiresAt = null;
    await this.userRepo.save(user);

    const token = generateJWT({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      isEmailVerified: user.isEmailVerified,
      message: "Login successful",
    };
  }

  async adminLogin(email: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      select: [
        "id",
        "firstName",
        "lastName",
        "email",
        "password",
        "isEmailVerified",
        "role",
      ],
    });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check if user has admin role
    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      throw new Error("Access denied. Admin privileges required");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
    if (!user.isEmailVerified) {
      throw new Error("Email not verified");
    }

    const token = generateJWT({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      message: "Admin login successful",
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepo.findOne({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return {
        message:
          "If an account with that email exists, a password reset link has been sent",
      };
    }

    // Generate reset password token
    const resetToken = generateToken(32);
    const hashedResetToken = hashToken(resetToken);
    const resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Update user with reset token
    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordTokenExpiresAt = resetPasswordExpiresAt;
    await this.userRepo.save(user);

    // TODO: Send email with reset link
    // Example: sendEmail(user.email, `http://localhost:3000/reset-password?token=${resetToken}`)

    return {
      message:
        "If an account with that email exists, a password reset link has been sent",
      // For testing only - remove in production:
      resetToken: resetToken,
    };
  }

  async resetPassword(token: string, newPassword: string) {
    // Hash the incoming token to compare with stored hash
    const hashedToken = hashToken(token);

    // Find user with this reset token
    const user = await this.userRepo
      .createQueryBuilder("user")
      .addSelect("user.resetPasswordToken")
      .addSelect("user.resetPasswordTokenExpiresAt")
      .where("user.resetPasswordToken = :token", { token: hashedToken })
      .getOne();

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    // Check if token has expired
    if (
      user.resetPasswordTokenExpiresAt &&
      user.resetPasswordTokenExpiresAt < new Date()
    ) {
      throw new Error("Reset token has expired");
    }

    // Hash the new password and update user
    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpiresAt = null;
    await this.userRepo.save(user);

    return { message: "Password reset successfully" };
  }
}
