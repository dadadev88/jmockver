#!/usr/bin/env node
import nodemon from 'nodemon';

nodemon({
  script: __dirname + '/server/jmockver.js',
  ext: 'json',
  args: process.argv.slice(2)
});

nodemon.on('start', function () {
  console.log(`\n[JSONMockServer] ✅  Starting`);
}).on('quit', function () {
  console.log(`\n[JSONMockServer] 🛑  Stoped`);
  process.exit();
}).on('restart', function () {
  console.log(`\n[JSONMockServer] 🔄  Restarting`);
});