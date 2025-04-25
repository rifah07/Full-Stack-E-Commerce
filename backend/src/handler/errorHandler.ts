import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //console.error('Error caught:', error);

  if (error?.message) {
    res.status(400).json({
      status: 'failed',
      error: error.message,
    });
  } else {
    res.status(400).json({
      status: 'failed',
      error,
    });
  }
};
//export default errorHandler;