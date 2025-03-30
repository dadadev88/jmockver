import nodemon from 'nodemon';
import path from 'node:path';
import CLIargs from 'minimist';
import { LoggerUtil } from '../lib/utils/logger.util';
import { JMockverConstants } from './server/symbols/jmockver.constants';

const args = CLIargs(process.argv.slice(2));

function run(args: CLIargs.ParsedArgs, nodemonArgs: string[]): void {
  nodemon({
    script: path.join(__dirname, './server/jmockver.js'),
    ext: 'json',
    args: nodemonArgs
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
}

if (args.help) {
  LoggerUtil.help();
  process.exit(1);
} else {
  run(args, process.argv.slice(2))
}
