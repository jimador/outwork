#!/usr/bin/env bash

printf "Checking Prettier... 🔎\n"
prettier "**/*.{ts,js,json,css,scss,md,yml,graphql}" --list-different --ignore-path=.prettierignore
PRETTIER_STATUS=$?

printf "\nChecking ESLint... 🔎"
eslint '**/*.{js,ts}' --ignore-path=.eslintignore
ESLINT_STATUS=$?

printf "\nChecking CRLF... 🔎"
find . -type f \
  ! -path "*/node_modules/*" \
  ! -path "*/coverage/*" \
  ! -path "*/build/*" \
  ! -path "*/.*/*" \
  -exec file "{}" ";" | grep CRLF
SCRIPTS_STATUS=$?

printf "\n"

if [[ $PRETTIER_STATUS -eq 1 || $ESLINT_STATUS -eq 1 || $SCRIPTS_STATUS -eq 0 ]]; then
  echo "Please run 'yarn format'"
  exit 1
fi
