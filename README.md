![](https://github.com/jimador/outwork/workflows/build/badge.svg)

# Outwork

Fault tolerance tools for TypeScript

> out·work
>
> /ˈoutˌwərk/
>
> a section of a fortification or system of defense which is in front of the main part.

## Example Usage

As a Decorator

```ts
class SomeClass {
  @retry({
    maxAttempts: 3,
    backOff: 100,
    backOffPolicy: BackOffPolicy.CONSTANT,
    shouldRetry: (e: Error) => {
      return e.message === 'Error: 429'
    },
  })
  async someFnWithConstantRateRetries(): Promise<any> {
    throw new Error('Error: 404')
  }

  @retry({
    maxAttempts: 3,
    backOffPolicy: BackOffPolicy.EXPONENTIAL,
    maxDelay: 1000,
    minDelay: 100,
    jitter: true,
  })
  async someFnWithExponentialBackOffRetries(): Promise<any> {
    return new Promise((_, reject) => {
      reject(new Error('Broke'))
    })
  }
}
```

As a HoF:

```ts
const myAsyncFunc = async (num: number, str: string): Promise<void> => {...}

const myAsyncFuncWithRetries =
  withRetry(myAsyncFunc, {
    maxAttempts: 3,
    backOffPolicy: BackOffPolicy.EXPONENTIAL,
    maxDelay: 1000,
    minDelay: 100,
    jitter: true
  })
```

Tools:

- [TypeScript][typescript] [4.0][typescript-4-0]
- [ESLint][eslint]
- [Jest][jest]
- [Prettier][prettier]
- Reproducible environments with [Volta][volta]
  - [install][volta-getting-started] Volta
- .editorconfig for consistent file format
- [Dependabot] updates
- [KodiakHQ] automerges

## Available Scripts

- `build` - compile TS
- `build:watch` - interactive watch mode to automatically transpile source files
- `checkcommit` - validate commit message
- `clean` - remove coverage data, Jest cache and transpiled files,
- `clean-deps` - remove `node_modules`
- `clean-generated` - remove coverage and build directories and files
- `clean-logs` - remove log files
- `commit` - start commit
- `format` - format files
- `lint` - lint source files and tests,
- `nuke` - clean everything
- `sort-pj` - sort `package.json`
- `test` - run tests,
- `test:watch` - interactive watch mode to automatically re-run tests

[typescript]: https://www.typescriptlang.org/
[typescript-4-0]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html
[jest]: https://facebook.github.io/jest/
[eslint]: https://github.com/eslint/eslint
[prettier]: https://prettier.io
[volta]: https://volta.sh
[volta-getting-started]: https://docs.volta.sh/guide/getting-started
[dependabot]: https://dependabot.com/
[kodiakhq]: https://kodiakhq.com/
