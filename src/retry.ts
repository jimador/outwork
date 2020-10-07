import { BackOff, RetryConfiguration } from './backoff'
import { RetryError } from './error'
import { createLogger } from './logger'
import { wait } from './utils'

const logger = createLogger()

// eslint-disable-next-line @typescript-eslint/ban-types
export function retry(options: RetryConfiguration): Function {
  return function (_: Record<string, unknown>, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const wrappedFn: Function = descriptor.value

    descriptor.value = async function (this: any, ...args: any[]) {
      try {
        return await withRetry(wrappedFn.bind(this), options)(...args)
      } catch (O_o: unknown) {
        if (O_o instanceof RetryError) {
          throw O_o
        }

        if (O_o instanceof Error) {
          throw RetryError.of(`Retry failed for property ${propertyKey} with message: ${O_o.message}`, O_o)
        }

        throw RetryError.of(`Retry failed for property ${propertyKey} : ${JSON.stringify(O_o)}`)
      }
    }

    return descriptor
  }
}

/**
 * Default shouldRetry method. Log the error and return true
 * @param e - {@link Error} the error to log
 */
const logAndRetry = (e: Error): boolean => {
  logger.error(e.message)

  return true
}

/**
 * Default abortRetry method. Log the error and return false
 * @param e - {@link Error} the error to log
 */
const abortDefault = (e: Error): boolean => !logAndRetry(e)

/**
 * Helper type to infer the args and return type from a function
 */
type InferFunc<F extends (...args: any) => any> = (...args: Parameters<F>) => Promise<ReturnType<F>>

/**
 * Executes a function to wrapped with retry logic.
 */
export const withRetry = <F extends (...params: any[]) => any>(fn: F, options: RetryConfiguration): InferFunc<F> => {
  const shouldRetry = options.shouldRetry ?? logAndRetry
  const shouldStop = options.abortRetry ?? abortDefault

  const executeWithBackOff = (attempt: BackOff): InferFunc<F> => async (
    ...args: Parameters<F>
  ): Promise<ReturnType<F>> => {
    try {
      const res = await fn(...args)

      return res
    } catch (e) {
      if (shouldStop(e)) {
        throw RetryError.of(`Retry halted due to policy with: ${e.message}`, e)
      } else {
        const { currentAttempt, maxAttempts } = attempt

        if (currentAttempt >= maxAttempts + 1) {
          logger.error(e.message, e)
          throw RetryError.of(`Retry failed after ${maxAttempts} attempts.`, e)
        } else if (!shouldRetry(e)) {
          throw e
        }
      }

      await wait(attempt.getBackOff())

      const next = executeWithBackOff(attempt.getNextAttempt())

      return new Promise((resolve) => {
        process.nextTick(() => {
          resolve(next(...args))
        })
      })
    }
  }

  return executeWithBackOff(BackOff.from(options))
}
