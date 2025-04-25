export default class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;

    //helps when extending built-in classes like Error
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}