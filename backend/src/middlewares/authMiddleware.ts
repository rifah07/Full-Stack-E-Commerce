import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";
import logger from "../utils/logger";
import { UnauthorizedError, ForbiddenError } from "../utils/errors";
import catchAsync from "../utils/catchAsync";

export interface AuthRequest extends Request {
  user?: JwtPayload & { id: string };
}

const auth = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;

    // Bearer method
    // const accessToken = req.headers.authorization?.replace("Bearer ", "");

    if (!accessToken) {
      throw new UnauthorizedError("Unauthorized - No token provided.");
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(
        accessToken,
        process.env.JWT_SECRET as string
      ) as JwtPayload;
    } catch (error) {
      logger.error("Invalid Token: " + (error as Error).message);
      throw new UnauthorizedError("Unauthorized - Invalid token.");
    }

    if (!decoded || !decoded._id) {
      throw new UnauthorizedError("Unauthorized - User ID missing in token.");
    }

    const user = await User.findById(decoded._id);
    if (!user) {
      throw new UnauthorizedError("Unauthorized - User not found.");
    }

    if (user.isBanned) {
      throw new ForbiddenError("Access denied - Your account is banned.");
    }

    req.user = { ...decoded, id: decoded._id };
    next();
  }
);

export default auth;
