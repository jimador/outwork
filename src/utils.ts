/**
 * Waiting function
 * @param sleepTimeMs - time to wait in milliseconds.
 */
export const wait = async (sleepTimeMs: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, sleepTimeMs))
