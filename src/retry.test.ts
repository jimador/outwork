import { retry } from './retry'
import { BackOffPolicy } from './backoff'

describe('retry tests', () => {
  // hack to reset global setTimeout between tests
  afterEach(() => {
    jest.useFakeTimers()
    jest.resetAllMocks()
    jest.useRealTimers()
  })
  describe('retry exponential backoff', () => {
    it('should exponentialBackOffRetryNoJitter should start with min value', async () => {
      const timeout = jest.spyOn(global, 'setTimeout')
      try {
        await TestRetry.exponentialBackOffRetryNoJitter()
        expect(0).toBeNull()
      } catch (e) {
        expect(e.message).toBe('Retry failed after 3 attempts.: Broke')
        expect(timeout).toBeCalledTimes(3)
        const calls = timeout['mock'].calls
        expect(calls[0][1]).toBe(200)
        expect(calls[1][1]).toBe(400)
        expect(calls[2][1]).toBe(800)
      }
    }, 30000)
  })
  describe('do retry', () => {
    it('should shouldRetry based on predicate', async () => {
      try {
        await TestRetry.shouldRetry()
        fail('unexpected')
      } catch (e) {
        expect(e.message).toBe(`Retry failed for property shouldRetry with message: Failed for 'shouldRetry': Failed for 'shouldRetry'`)
      }
    })
  })
  describe('do not retry', () => {
    it('should not retry if predicate fails', async () => {
      try {
        await TestRetry.doNotRetry()
        fail('unexpected')
      } catch (e) {
        expect(e.message).toBe(`Retry failed for property doNotRetry with message: Error: 404: Error: 404`)
      }
    })
  })
  describe('halt retry', () => {
    it('should not retry if halt predicate is true', async () => {
      const timeout = jest.spyOn(global, 'setTimeout')
      try {
        await TestRetry.haltRetry()
        fail('unexpected')
      } catch (e) {
        expect(e.message).toBe(`Retry halted due to policy with: Error: 429: Error: 429`)
        const calls = timeout['mock'].calls
        expect(calls[0]).toBeUndefined()
      }
    })
  })
  describe('retry fixed backoff', () => {
    it('should do fixed backoff retry', async () => {
      const timeout = jest.spyOn(global, 'setTimeout')
      try {
        await TestRetry.fixedBackOffRetry()
        expect(0).toBeNull()
      } catch (e) {
        expect(e.message).toBe(`Retry failed after 3 attempts.: Broke`)
        expect(timeout).toBeCalledTimes(3)
        const calls = timeout['mock'].calls
        expect(calls[0][1]).toBe(100)
        expect(calls[1][1]).toBe(100)
        expect(calls[2][1]).toBe(100)
      }
    })
  })
})


class TestRetry {

  @retry({
    maxAttempts: 3,
    backOff: 100,
    backOffPolicy: BackOffPolicy.CONSTANT,
    shouldRetry: (e: Error) => {
      return e.message === 'Error: 429'
    },
  })
  static async shouldRetry(): Promise<any> {
    throw new Error('Failed for \'shouldRetry\'')
  }

  @retry({
    maxAttempts: 3,
    backOff: 100,
    backOffPolicy: BackOffPolicy.CONSTANT,
    shouldRetry: (e: Error) => {
      return e.message === 'Error: 429'
    },
  })
  static async doNotRetry(): Promise<any> {
    throw new Error('Error: 404')
  }

  @retry({
    maxAttempts: 3,
    backOff: 100,
    backOffPolicy: BackOffPolicy.CONSTANT,
    abortRetry: (e: Error) => {
      return e.message === 'Error: 429'
    },
  })
  static async haltRetry(): Promise<any> {
    throw new Error('Error: 429')
  }

  @retry({
    maxAttempts: 3,
    backOffPolicy: BackOffPolicy.CONSTANT,
    backOff: 100,
  })
  static async fixedBackOffRetry(): Promise<any> {
    throw new Error(`Broke`)
  }

  @retry({
    maxAttempts: 3,
    backOffPolicy: BackOffPolicy.EXPONENTIAL,
    maxDelay: 1000,
    minDelay: 100,
    jitter: false
  })
  static async exponentialBackOffRetryNoJitter(): Promise<any> {
    return new Promise((_, reject) => {
      reject(new Error('Broke'))
    })
  }
}
