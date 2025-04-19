import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: JwtPayload;
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

    const jwt_payload = jwt.verify(
      accessToken,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    req.user = jwt_payload;
  } catch (e) {
     res.status(401).json({
      status: "Failed",
      message: "Unauthorized - Invalid token",
    });
    return;
  }

  next();
};

export default auth;