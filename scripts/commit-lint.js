#!/usr/bin/env node
const gitMessage = require('child_process').execSync('git log -1 --no-merges').toString().trim()

const { types, scopes } = require('../.cz-config.js')

const allowedTypes = types.map((type) => type.value)
const allowedScopes = scopes.map((scope) => scope.name)

const commitMsgRegex = `(${allowedTypes.join('|')})\\((${allowedScopes.join('|')})\\):\\s(([a-z0-9:-\\s])+)`

const matchCommit = new RegExp(commitMsgRegex, 'g').test(gitMessage)
const matchRevert = /Revert/gi.test(gitMessage)
const matchRelease = /Release/gi.test(gitMessage)
const exitCode = +!(matchRelease || matchRevert || matchCommit)

console.log('🔎 Validating git commit message 🔍')

if (exitCode === 0) {
  console.log('💰 Commit ACCEPTED 💰')
} else {
  console.log(
    `[Error]: 💔 Your commit message: \n
    -------------------------------------------------------------------\n
    gitMessage
    \n-------------------------------------------------------------------
    \n\n Does not follow the commit message convention specified in the README.md file.`,
  )

  console.log('\ntype(scope): subject \n BLANK LINE \n body')
  console.log('\n')
  console.log(`possible types: ${allowedTypes.join('|')}`)
  console.log(`possible scopes: ${allowedScopes.join('|')} (if unsure use "cleanup")`)
  console.log(`\nEXAMPLE: \n feat(some_feature): add function to do stuff\n`)
}

process.exit(exitCode)
