import winston from 'winston';

const logFormat = winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
  let log = `${timestamp} [${level.toUpperCase()}] ${message}`;
  if (stack) {
    log += `\n${stack}`;
  }
  if (Object.keys(meta).length) {
    log += `\n${JSON.stringify(meta, null, 2)}`;
  }
  return log;
});

export const logger = winston.createLogger({
  level: process.env['LOG_LEVEL'] || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.colorize(),
    logFormat
  ),
  defaultMeta: { service: 'mystery-box-game' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ],
  exitOnError: false
}); 