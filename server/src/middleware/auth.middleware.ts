import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt";
import { UserRole } from "../constant/enums";

/**
 * Authentication middleware - Verifies JWT token
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
      });
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
      });
    }

    // Verify token
    const decoded = verifyJWT(token) as {
      id: string;
      email: string;
      role: UserRole;
    };

    // Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

/**
 * Authorization middleware - Checks user roles
 * @param allowedRoles - Array of roles that are allowed to access the route
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions.",
      });
    }

    next();
  };
};

/**
 * Admin-only middleware - Shortcut for ADMIN and SUPER_ADMIN roles
 */
export const adminOnly = authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN);

/**
 * Manager and above middleware - PROJECT_MANAGER, ADMIN, SUPER_ADMIN
 */
export const managerAndAbove = authorize(
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.PROJECT_MANAGER
);
/**
 * Team management middleware - SUPER_ADMIN, ADMIN, PROJECT_MANAGER only
 */
export const teamManagement = authorize(
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.PROJECT_MANAGER
);

/**
 * Task assignment middleware - SUPER_ADMIN, ADMIN, PROJECT_MANAGER, TEAM_LEAD
 */
export const taskAssignment = authorize(
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.PROJECT_MANAGER,
  UserRole.TEAM_LEAD
);
