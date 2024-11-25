import { existsSync } from 'node:fs';
import { join } from 'node:path';
import express, { type Express } from 'express';
import CLIargs from 'minimist';
import cors from 'cors';
import morgan from 'morgan';
import { JMockverRoutesUtils } from './utils/jmockver-route.util';
import { JMockverFileUtils } from './utils/jmockver-file.util';
import { LoggerUtil } from '../utils/logger.util';
import { JMockverConstants } from './contants/jmockver.constants';

class JMockver {
  private readonly app: Express = express();
  private readonly isLoggerEnabled: boolean = false;

  constructor(private readonly cliArgs: CLIargs.ParsedArgs) {
    this.app.use(cors());
    this.cliArgs = cliArgs;
    this.isLoggerEnabled = this.cliArgs.logger === true || this.cliArgs.logger === 'true';

    if (this.isLoggerEnabled) {
      const hasLoggerFormat = Boolean(this.cliArgs.loggerFormat);
      const loggerFormat = hasLoggerFormat ? this.cliArgs.loggerFormat : 'tiny';
      this.app.use(morgan(loggerFormat));
    }
  }

  async run(): Promise<void> {
    const dirArg = this.cliArgs.dir ?? 'mocks';
    const mocksFolder = join('./', dirArg);

    if (existsSync(mocksFolder)) {
      LoggerUtil.info(`🔎 Searching JSON mock files in "${mocksFolder}" dir`);

      const fileUtils = new JMockverFileUtils();
      const files = await fileUtils.getJSONFilenames(mocksFolder);

      const routesUtils = new JMockverRoutesUtils(this.app);
      await routesUtils.generateRoutesFromJSONFiles(mocksFolder, files);

      const port = this.cliArgs.port ?? JMockverConstants.APP_PORT_DEFAULT;
      this.app.listen(port, () => {
        if (this.isLoggerEnabled)
          LoggerUtil.info(`👁️ Logger enabled`);
        LoggerUtil.info(`✅ Server running on port ${port}`);
      });
    } else {
      LoggerUtil.info(`❌ Don't exists "${mocksFolder}" folder, create it or change --dir argument`);
    }
  }
}

function main(cliArguments: CLIargs.ParsedArgs) {
  const { _, ...finalArgs } = cliArguments;
  LoggerUtil.info(`🧰 ${Object.keys(finalArgs).length
    ? 'Run with arguments ' + JSON.stringify(finalArgs)
    : 'Run with default arguments'}`);

  const server = new JMockver(cliArguments);
  server.run();
}

const args = CLIargs(process.argv.slice(2));
main(args);
