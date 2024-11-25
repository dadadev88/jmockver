!#/bin/bash

echo "[JMockver] Building package..."
npm run build

echo "[JMockver] Copying package files..."
mkdir lib && cp -r dist/* ./lib && cp -r src/lib/templates ./lib

echo "[JMockver] Minifying package..."
minify-all-js lib

echo "[JMockver] Copying bin files..."
mkdir bin && cp -r src/bin/* ./bin

echo "[JMockver] Packing package..."
npm pack

echo "[JMockver] Cleaning up..."
rm -rf bin/ lib/