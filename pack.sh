#!/bin/sh

echo "[JMockver] Building package..."
rm -rf dist/ && npx tsc -p .

echo "[JMockver] Copying template files..."
mkdir -p dist/templates && cp -r src/lib/templates/* ./dist/templates

echo "[JMockver] Copying package files..."
mkdir -p lib && cp -r dist/* ./lib

echo "[JMockver] Minifying package..."
npx minify-all-js lib

echo "[JMockver] Copying bin files..."
mkdir bin && cp -r src/bin/* ./bin

echo "[JMockver] Packing package..."
npm pack
