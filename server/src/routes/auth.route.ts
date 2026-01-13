import express from "express";
import { AuthController } from "../controllers/auth.controller";

export const authRoutes = express.Router();

authRoutes.post("/register", AuthController.register);
authRoutes.post("/verify-email", AuthController.verifyEmail);
authRoutes.post("/resend-verification", AuthController.resendVerificationEmail);
authRoutes.post("/login", AuthController.login);
authRoutes.post("/admin-login", AuthController.adminLogin);
authRoutes.post("/forgot-password", AuthController.forgotPassword);
authRoutes.post("/reset-password", AuthController.resetPassword);
