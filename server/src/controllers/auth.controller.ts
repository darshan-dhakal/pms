import { AuthService } from "../services/auth.service";
import { Request, Response } from "express";
import { IUser } from "../constant/user";
import { Message } from "../constant/messages";

const authService = new AuthService();
export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, password } = req.body;
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const result = await authService.register({
        firstName,
        lastName,
        email,
        password,
      });
      return res.status(201).json(result);
    } catch (error: any) {
      if (error.message === "User already exists") {
        return res.status(409).json({ message: error.message });
      }
      console.error("Register error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async verifyEmail(req: Request, res: Response) {
    try {
      // const { token } = req.query;
      const { token } = req.body;
      if (!token || typeof token !== "string") {
        return res
          .status(400)
          .json({ message: "Verification token is required" });
      }
      const result = await authService.verifyEmail(token);
      return res.status(200).json(result);
    } catch (error: any) {
      if (
        error.message === "Invalid verification token" ||
        error.message === "Verification token has expired"
      ) {
        return res.status(400).json({ message: error.message });
      }
      console.error("Verify email error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async resendVerificationEmail(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      const result = await authService.resendVerificationEmail(email);
      return res.status(200).json(result);
    } catch (error: any) {
      if (
        error.message === "User not found" ||
        error.message === "Email already verified"
      ) {
        return res.status(400).json({ message: error.message });
      }
      console.error("Resend verification email error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }
      const result = await authService.loginUser(email, password);
      return res.status(200).json(result);
    } catch (error: any) {
      if (
        error.message === "Invalid email or password" ||
        error.message === "Email not verified"
      ) {
        return res.status(400).json({ message: error.message });
      }
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async requestLoginOTP(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }
      const result = await authService.sendLoginOTP(email);
      return res.status(200).json(result);
    } catch (error: any) {
      if (
        error.message === "Invalid email or password" ||
        error.message === "Email not verified"
      ) {
        return res.status(400).json({ message: error.message });
      }
      console.error("Request login OTP error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async verifyLoginOTP(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
      }
      const result = await authService.verifyLoginOTP(email, otp);
      return res.status(200).json(result);
    } catch (error: any) {
      if (
        error.message === "Invalid OTP" ||
        error.message === "OTP has expired"
      ) {
        return res.status(400).json({ message: error.message });
      }
      console.error("Verify login OTP error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async adminLogin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }
      const result = await authService.adminLogin(email, password);
      return res.status(200).json(result);
    } catch (error: any) {
      if (
        error.message === "Invalid email or password" ||
        error.message === "Email not verified" ||
        error.message === "Access denied. Admin privileges required"
      ) {
        return res.status(400).json({ message: error.message });
      }
      console.error("Admin login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      const result = await authService.forgotPassword(email);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Forgot password error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return res
          .status(400)
          .json({ message: "Token and new password are required" });
      }
      const result = await authService.resetPassword(token, newPassword);
      return res.status(200).json(result);
    } catch (error: any) {
      if (
        error.message === "Invalid or expired reset token" ||
        error.message === "Reset token has expired"
      ) {
        return res.status(400).json({ message: error.message });
      }
      console.error("Reset password error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
