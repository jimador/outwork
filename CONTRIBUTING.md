# Contributing

## Submission Guidelines

### <a name="submit-pr"></a> Submitting a PR

Please follow the following guidelines:

- Make sure unit tests pass (`yarn test`)
- Make sure you run `yarn format`
- Update your commit message to follow the guidelines below (use `yarn commit` to automate compliance)
  - `yarn checkcommit` will check to make sure your commit messages are formatted correctly

#### Commit Message Guidelines

The commit message should follow the following format:

```
type(scope): subject
BLANK LINE
body
```

##### Type

The type must be one of the following:

- feat
- fix
- docs
- cleanup
- chore

##### Scope

The scope must be one of the following:

- docs - anything related to docs
- infrastructure - anything infrastructure specific
- be - anything backend specific
- fe - anything frontend specific
- linter - anything Linter specific
- storybook - anything Storybook specific
- testing - anything testing specific (e.g., jest or cypress)
- repo - anything related to managing the repo itself
- misc - misc items that do not fall in to one of the above scopes

##### Subject and Body

The subject must contain a description of the change, and the body of the message contains any additional details to provide more context about the change.

Please including the ticket number that the pull request relates.

#### Example

```
feat(payments): add new payment source

`SpacelyPayments.ts` accept payments directly from Spacely Sprockets

Closes #12345
```

#### Commitizen

To simplify and automate the process of committing with this format,
**This is a [Commitizen](https://github.com/commitizen/cz-cli) friendly repository**, just do `git add` and execute `yarn commit`.

[scripts]: scripts
