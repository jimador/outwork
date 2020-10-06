#!/usr/bin/env bash

echo "Checking Prettier"
prettier "**/*.{ts,js,json,css,scss,md,yml,graphql}" --list-different --ignore-path=.prettierignore
PRETTIER_STATUS=$?

echo "Checking ESLint"
eslint '**/*.{js,ts}' --ignore-path=.eslintignore
ESLINT_STATUS=$?

echo "Checking CRLF"
find scripts -type f -exec file "{}" ";" | grep CRLF
SCRIPTS_STATUS=$?

echo "    ...Checking apps 🔎"
find apps -type f ! -path "*/node_modules/*" -exec file "{}" ";" | grep CRLF
APPS_STATUS=$?

echo "    ...Checking libs 🔎"
find libs -type f ! -path "*/node_modules/*" -exec file "{}" ";" | grep CRLF
LIBS_STATUS=$?

if [[ $PRETTIER_STATUS -eq 1 || $ESLINT_STATUS -eq 1 || $SCRIPTS_STATUS -eq 0 || $APPS_STATUS -eq 0 || $LIBS_STATUS -eq 0 ]]; then
  echo "Please run 'yarn format'"
  exit 1
fi
