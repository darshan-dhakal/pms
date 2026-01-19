import { UserRole } from "../constant/enums";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
        isEmailVerified?: boolean;
      };
    }
  }
}

export {};
