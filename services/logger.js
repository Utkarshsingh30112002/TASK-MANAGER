import winston from "winston";

const { combine, timestamp, printf, errors } = winston.format;

const customFormat = printf(({ level, message, timestamp, stack, details }) => {
  return `${timestamp} ${level}: ${stack || message} ${details ? JSON.stringify(details) : ''}`;
});

const logger = winston.createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }), 
    customFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

export default logger;
