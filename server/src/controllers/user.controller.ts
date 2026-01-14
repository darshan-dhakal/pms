import { Request, Response } from "express";
import { AppDataSource } from "../config/datasource";
import { User } from "../entities/user.entity";
import { UserRole } from "../constant/enums";

const userRepository = AppDataSource.getRepository(User);

export class UserController {
  /**
   * Get current user's profile
   */
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      const user = await userRepository.findOne({
        where: { id: userId },
        select: [
          "id",
          "firstName",
          "lastName",
          "email",
          "role",
          "isEmailVerified",
          "isActive",
        ],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          isActive: user.isActive,
        },
      });
    } catch (error) {
      console.error("Get profile error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Get all users (Admin only)
   */
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userRepository.find({
        select: [
          "id",
          "firstName",
          "lastName",
          "email",
          "role",
          "isEmailVerified",
          "isActive",
        ],
        order: { createdAt: "DESC" },
      });

      return res.status(200).json({
        users,
        total: users.length,
      });
    } catch (error) {
      console.error("Get all users error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Get user by ID (Admin only)
   */
  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await userRepository.findOne({
        where: { id },
        select: [
          "id",
          "firstName",
          "lastName",
          "email",
          "role",
          "isEmailVerified",
          "isActive",
        ],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ user });
    } catch (error) {
      console.error("Get user by ID error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Update user role (Admin only)
   */
  static async updateUserRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!role) {
        return res.status(400).json({ message: "Role is required" });
      }

      // Prevent assigning SUPER_ADMIN to anyone (no new super-admins via API)
      if (role === UserRole.SUPER_ADMIN) {
        return res.status(403).json({
          message: "Assigning SUPER_ADMIN role is not allowed",
        });
      }

      const user = await userRepository.findOne({ where: { id } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.role = role;
      await userRepository.save(user);

      return res.status(200).json({
        message: "User role updated successfully",
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Update user role error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Delete own account (Self service)
  
  */
  static async toggleUserStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await userRepository.findOne({ where: { id } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Prevent toggling SUPER_ADMIN accounts
      if (user.role === UserRole.SUPER_ADMIN) {
        return res.status(403).json({
          message: "SUPER_ADMIN accounts cannot be deactivated or activated",
        });
      }

      user.isActive = !user.isActive;
      await userRepository.save(user);

      return res.status(200).json({
        message: `User has been ${user.isActive ? "activated" : "deactivated"} successfully`,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
      });
    } catch (error) {
      console.error("Toggle user status error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async deleteOwnAccount(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const user = await userRepository.findOne({ where: { id: userId } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Prevent deletion of SUPER_ADMIN accounts
      if (user.role === UserRole.SUPER_ADMIN) {
        return res.status(403).json({
          message: "SUPER_ADMIN accounts cannot be deleted via API",
        });
      }

      await userRepository.remove(user);

      return res.status(200).json({
        message: "Your account has been deleted successfully",
      });
    } catch (error) {
      console.error("Delete own account error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Delete user by ID (Admin only)
   */
  static async deleteUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await userRepository.findOne({ where: { id } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Prevent deletion of SUPER_ADMIN accounts
      if (user.role === UserRole.SUPER_ADMIN) {
        return res.status(403).json({
          message: "SUPER_ADMIN accounts cannot be deleted",
        });
      }

      await userRepository.remove(user);

      return res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Delete user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
