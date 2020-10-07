import { createLogger as CreateLogger, format as wFormat, Logger, LoggerOptions, transports } from 'winston'

/**
 * Create a {@link Logger} with configuration from config file.
 * @param options - optional {@link LoggerOptions} for configuration.
 */
export const createLogger = (options: LoggerOptions = {}): Logger => {
  const logger = CreateLogger({
    transports: [
      new transports.Console({
        format: wFormat.colorize(),
        level: options.level,
      }),
    ],
    ...options,
  })

  return logger
}
