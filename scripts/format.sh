#!/usr/bin/env bash

echo "Auto-fixing with Prettier"
prettier "**/*.{ts,js,json,css,scss,md,yml,graphql}" --list-different --ignore-path=.prettierignore --write

echo "Auto-fixing with ESLint"
eslint '**/*.{js,ts}' --ignore-path=.eslintignore --fix
