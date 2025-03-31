#!/bin/sh
CURRENT_VERSION=$(node -p "require('./package.json').version")
PREFIX="[JMockver - Version RC]"

echo "$PREFIX Current version is $CURRENT_VERSION"

if [[ $CURRENT_VERSION == *-rc* ]]; then
  echo "$PREFIX Current version is a RC version, update to new RC version"
  npm version prerelease --preid rc --no-git-tag-version
else
  echo "$PREFIX Current version is a stable version, set to -rc.0"
  npm version $CURRENT_VERSION-rc.0 --no-git-tag-version
fi

NEW_VERSION=$(node -p "require('./package.json').version")

echo "$PREFIX New RC version created $NEW_VERSION"

read -p "$PREFIX Do you want to commit (chore) and push the new RC version? (y/n): " confirm
if [[ $confirm == [yY] ]]; then
  CURRENT_BRANCH=$(git branch --show-current)
  echo "$PREFIX Commit and push the new RC version"
  git add package.json package-lock.json
  git commit -m "chore: Update RC version from $CURRENT_VERSION to $NEW_VERSION (VERSION-RC)"
  git push origin $CURRENT_BRANCH

  echo "$PREFIX ✅ PR to develop branch URL:"
  echo "https://github.com/dadadev88/jmockver/compare/develop...$CURRENT_BRANCH"
fi
