import express from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate, adminOnly } from "../middleware/auth.middleware";

export const userRoutes = express.Router();

// Protected route - User's own profile
userRoutes.get("/profile", authenticate, UserController.getProfile);

// Self-service routes
userRoutes.delete("/me", authenticate, UserController.deleteOwnAccount);

// Admin only routes
userRoutes.get("/", authenticate, adminOnly, UserController.getAllUsers);
userRoutes.get("/:id", authenticate, adminOnly, UserController.getUserById);
userRoutes.patch(
  "/:id/role",
  authenticate,
  adminOnly,
  UserController.updateUserRole
);
userRoutes.patch(
  "/:id/toggle-status",
  authenticate,
  adminOnly,
  UserController.toggleUserStatus
);
userRoutes.delete(
  "/:id",
  authenticate,
  adminOnly,
  UserController.deleteUserById
);
