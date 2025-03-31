#!/bin/sh
CURRENT_VERSION=$(node -p "require('./package.json').version")

echo "🔄 Validate current version is not a RC version"
if [[ $CURRENT_VERSION == *-rc* ]]; then
  echo "❌ Current version is already a RC version"
  echo "❌ Uptate to new stable version before creating a new RC version"
  exit 0
fi
echo "✅ OK, current version is a stable version $CURRENT_VERSION"

echo "🔄 Create a new RC version"
npm version prerelease --preid rc -m 'chore: RC package version updated to %s'

echo "✅ New RC version created"
NEW_VERSION=$(node -p "require('./package.json').version")
echo "✅ New RC version is $NEW_VERSION"
