import { Request, Response, NextFunction } from "express";
import logger from "./logger";
import AppError from "./AppError";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

const catchAsync = (fn: AsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((error) => {
      logger.error(error.message || error || "Unknown error occurred");
      if (!(error instanceof AppError)) {
        error = new AppError(error.message || "Internal Server Error", 500);
      }
      next(error);
    });
  };
};

export default catchAsync;