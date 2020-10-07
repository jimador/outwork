import VError from 'verror'

/**
 * An error that is raised when an unknown error occurs during a retry.
 */
export class RetryError extends VError {
  constructor(message = 'Retry Error', cause?: Error) {
    super(cause, message)
    Error.captureStackTrace(this, this.constructor)
  }

  static of(message?: string, error?: Error): RetryError {
    return new RetryError(message, error)
  }
}
