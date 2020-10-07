type BaseBackOffConfiguration = {
  backOffPolicy: BackOffPolicy
  maxAttempts: number
  shouldRetry?: (e: Error) => boolean
  abortRetry?: (e: Error) => boolean
}

export interface ConstantBackOffConfiguration extends BaseBackOffConfiguration {
  backOffPolicy: 'CONSTANT'
  backOff?: number
}

export interface ExponentialBackoffConfiguration extends BaseBackOffConfiguration {
  backOffPolicy: 'EXPONENTIAL'
  maxDelay: number
  minDelay: number
  multiplier?: number
  jitter?: boolean
}

export const BackOffPolicy = {
  CONSTANT: 'CONSTANT',
  EXPONENTIAL: 'EXPONENTIAL',
} as const

export type BackOffPolicy = keyof typeof BackOffPolicy

export type RetryConfiguration = ConstantBackOffConfiguration | ExponentialBackoffConfiguration

/**
 * Base class for holding retry attempt state
 */
export abstract class BackOff {
  maxAttempts: number
  currentAttempt: number

  protected constructor(maxAttempts: number, currentAttempt = 1) {
    this.maxAttempts = maxAttempts
    this.currentAttempt = currentAttempt
  }

  /**
   * Get number of ms to back off before next attempt
   */
  abstract getBackOff(): number

  /**
   * Get the next backoff
   */
  abstract getNextAttempt(): BackOff

  static from(options: RetryConfiguration): BackOff {
    switch (options.backOffPolicy) {
      case BackOffPolicy.CONSTANT:
        return new FixedBackOff({ ...defaultRetryOptions, ...options })
      case BackOffPolicy.EXPONENTIAL:
        return new ExponentialBackOff({ ...defaultExponentialConfig, ...options })
    }
  }
}

type BackOffOpts<T extends BaseBackOffConfiguration> = Omit<T, 'backOffPolicy'>
type FixedBackOffOptions = BackOffOpts<ConstantBackOffConfiguration>
type ExponentialBackoffOptions = BackOffOpts<ExponentialBackoffConfiguration>

/**
 * Attempt with fixed backoff strategy
 */
class FixedBackOff extends BackOff {
  backOff: number

  constructor({ maxAttempts, backOff }: FixedBackOffOptions, currentAttempt = 1) {
    super(maxAttempts, currentAttempt)
    this.backOff = backOff
  }

  /**
   * override
   */
  getBackOff(): number {
    return this.backOff
  }

  /**
   * override
   */
  getNextAttempt(): FixedBackOff {
    return new FixedBackOff(this, this.currentAttempt + 1)
  }
}

/**
 * Attempt with exponential backoff strategy
 */
class ExponentialBackOff extends FixedBackOff {
  maxDelay: number
  minDelay: number
  multiplier: number
  jitter: boolean
  backOff: number

  constructor(
    { maxAttempts, minDelay, maxDelay, multiplier = 1, jitter = true }: ExponentialBackoffOptions,
    currentAttempt = 1,
  ) {
    super({ maxAttempts, backOff: 0 }, currentAttempt)
    this.maxDelay = maxDelay
    this.minDelay = minDelay
    this.multiplier = multiplier
    this.jitter = jitter
  }

  /**
   * override
   */
  getBackOff(): number {
    if (!this.backOff) {
      this.backOff = this.calculateBackOff()
    }

    return this.backOff
  }

  /**
   * override
   */
  getNextAttempt(): ExponentialBackOff {
    return new ExponentialBackOff(this, this.currentAttempt + 1)
  }

  /**
   * Calculate backoff using the "full jitter" strategy.
   *
   * See https://www.awsarchitectureblog.com/2015/03/backoff.html
   */
  private calculateBackOff(): number {
    let delay = this.minDelay

    if (delay > 0) {
      if (this.multiplier) {
        delay *= Math.pow(this.multiplier, this.currentAttempt)
      }

      if (this.jitter) {
        const min = Math.ceil(this.minDelay)
        const max = Math.floor(delay)
        delay = Math.floor(Math.random() * (max - min + 1)) + min
      }
    }

    return Math.min(delay, this.maxDelay)
  }
}

const defaultRetryOptions: Partial<ConstantBackOffConfiguration> = {
  backOffPolicy: BackOffPolicy.CONSTANT,
  backOff: 0,
}

const defaultExponentialConfig: Partial<ExponentialBackoffConfiguration> = {
  maxDelay: 2000,
  minDelay: 0,
  multiplier: 2,
  jitter: false,
}
