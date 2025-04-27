import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";
import { ForbiddenError } from "../utils/errors";

/**
 * Middleware to check if the user's role is authorized.
 * @param roles List of allowed roles (['admin', 'seller'])
 */
const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      throw new ForbiddenError("Access denied - No role found.");
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError("Access denied - Insufficient permissions.");
    }

    next();
  };
};

export default authorize;
