#!/usr/bin/env node
import nodemon from 'nodemon';
import path from 'node:path';
import CLIargs from 'minimist';

const args = CLIargs(process.argv.slice(2));

nodemon({
  script: path.join(__dirname, '/server/jmockver.js'),
  ext: 'json',
  args: process.argv.slice(2)
});

nodemon.on('start', () => {
  console.log(`\n[JMockver] ✅  Starting on port ${args.port ?? 3000}`);
}).on('quit', () => {
  console.log('\n[JMockver] 🛑  Stoped');
  process.exit();
}).on('restart', () => {
  console.log('\n[JMockver] 🔄  Restarting');
});
