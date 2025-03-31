#!/bin/sh
CURRENT_VERSION=$(node -p "require('./package.json').version")
PREFIX="[JMockver Action - RC]"

echo "Validate current version is not a RC version"
if [[ $CURRENT_VERSION == *-rc* ]]; then
  echo "$PREFIX Current version is already a RC version"
  echo "$PREFIX Uptate to new stable version before creating a new RC version"
  exit 0
fi
echo "$PREFIX Current version is a stable version $CURRENT_VERSION"

echo "$PREFIX Create a new RC version"
npm version prerelease --preid rc --no-git-tag-version
NEW_VERSION=$(node -p "require('./package.json').version")

echo "$PREFIX New RC version created"

echo "$PREFIX Commit the new RC version"
git add .
git commit -m "chore: Update RC version to $NEW_VERSION"

echo "$PREFIX ✅ Commit with new RC version created, push to origin"

