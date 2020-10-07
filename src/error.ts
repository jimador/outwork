import VError from 'verror'

/**
 * An error that is raised when an unknown error occurs during a retry.
 */
export class RetryError<T extends Error> extends VError {
  constructor(message = 'Retry Error', cause?: Error) {
    super(cause, message)
    Error.captureStackTrace(this, this.constructor)
  }

  static of<E extends Error>(message?: string, e?: E): RetryError<E> {
    return new RetryError<E>(message, e)
  }
}
