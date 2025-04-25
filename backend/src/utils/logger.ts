import winston from "winston";
import path from "path";

//Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    (info) => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`
  )
);

//Create logger
const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    //Write all logs to combined.log
    new winston.transports.File({
      filename: path.join(__dirname, "../../logs/combined.log"),
    }),

    //Write errors to error.log
    new winston.transports.File({
      filename: path.join(__dirname, "../../logs/error.log"),
      level: "error",
    }),
  ],
});

//log to console in development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export default logger;

/*
By using winston helps to:
1. Logs errors, warnings, info in a structured way,
2. Can log to console, files, or even external services (like Loggly, Sentry),
3. Helps debug faster and track issues in production
*/