import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: JwtPayload & { id?: string };
}

const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.headers.authorization?.replace("Bearer ", "");

    if (!accessToken) {
      res.status(401).json({
        status: "Failed",
        message: "Unauthorized - No token provided",
      });
      return;
    }

    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (!decoded || !decoded._id) {
      res.status(401).json({
        status: "Failed",
        message: "Unauthorized - User ID missing in token.",
      });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      status: "Failed",
      message: "Unauthorized - Invalid token",
    });
  }
};

export default auth;