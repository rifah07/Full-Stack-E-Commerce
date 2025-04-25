import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.status || error.statusCode || 500;
  const message = error?.message || error || "Internal Server Error";

  // Log the full error for debugging
  logger.error(`[${req.method}] ${req.originalUrl} - ${message}`);

  res.status(statusCode).json({
    status: "failed",
    message,
  });
};

export default errorHandler;