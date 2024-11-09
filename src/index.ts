#!/usr/bin/env node
import nodemon from 'nodemon';
import path from 'node:path';
import cliArguments from 'minimist';
import { LoggerUtil } from './server/utils/logger.util';
import { JMockverConstants } from './server/contants/jmockver.constants';

const args = cliArguments(process.argv.slice(2));

nodemon({
  script: path.join(__dirname, '/server/jmockver.js'),
  ext: 'json',
  args: process.argv.slice(2)
});

nodemon
  .on('start', () => {
    LoggerUtil.info(`✅ Starting server on port ${args.port ?? JMockverConstants.APP_PORT_DEFAULT}`);
  })
  .on('quit', () => {
    LoggerUtil.info('🛑 Server stoped');
    process.exit();
  })
  .on('restart', (files) => {
    LoggerUtil.info('🔄  Restarting server');
    if ((files?.length ?? 0) > 0) {
      LoggerUtil.info('🔄  Reloading routes');
      for (const file of (files ?? [])) {
        const filename = file.replace(__dirname, '');
        LoggerUtil.info(`🗂️  Routes in ${filename} file`);
      }
    }
  });
