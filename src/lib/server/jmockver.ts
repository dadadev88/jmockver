import { existsSync } from 'node:fs';
import { join } from 'node:path';
import express, { type Express } from 'express';
import CLIargs from 'minimist';
import cors from 'cors';
import morgan from 'morgan';
import { JMockverRoutesUtils } from './utils/jmockver-route.util';
import { JMockverFileUtils } from './utils/jmockver-file.util';
import { LoggerUtil } from '../utils/logger.util';
import { JMockverConstants } from './symbols/jmockver.constants';

class JMockver {
  private readonly app: Express = express();

  constructor(private readonly cliArgs: CLIargs.ParsedArgs) {
    this.cliArgs = cliArgs;

    this.loadMiddleware();
  }

  private loadMiddleware(): void {
    this.app.use(cors());
    this.app.use(morgan(this.cliArgs.loggerFormat ?? 'tiny'));
  }

  async run(): Promise<void> {
    const dirArg = this.cliArgs.dir ?? 'mocks';
    const mocksFolder = join('./', dirArg);

    if (existsSync(mocksFolder)) {
      LoggerUtil.info(`🔎 Searching JSON mock files in "${mocksFolder}" dir`);

      const fileUtils = new JMockverFileUtils();
      const files = await fileUtils.getJSONFilenames(mocksFolder);

      if (files.length === 0) {
        LoggerUtil.info(`❌ No mock files found in "${mocksFolder}" dir. Create one or more mock files.`);
        LoggerUtil.info(`💡 See examples in https://github.com/dadadev88/jmockver/tree/master/examples`);
        return;
      }

      const routesUtils = new JMockverRoutesUtils(this.app);
      await routesUtils.generateRoutesFromJSONFiles(mocksFolder, files);

      const port = this.cliArgs.port ?? JMockverConstants.APP_PORT_DEFAULT;
      this.app.listen(port, () => {
        LoggerUtil.jumpLine();
        LoggerUtil.info(`✅ Mock server running on http://localhost:${port} or http://127.0.0.1:${port}`);
        LoggerUtil.info(`👁️ See all routes in http://localhost:${port}/jmockver/routes`);
      });
    } else {
      LoggerUtil.info(`❌ Don't exists "${mocksFolder}" folder, create it or change --dir argument`);
    }
  }
}

function main(cliArguments: CLIargs.ParsedArgs) {
  const { _, ...finalArgs } = cliArguments;
  LoggerUtil.info(`🧰 Running JMockver with ${Object.keys(finalArgs).length
    ? 'arguments ' + JSON.stringify(finalArgs)
    : 'default arguments. Run with --help to see all arguments'}`);

  const server = new JMockver(cliArguments);
  server.run();
}

const args = CLIargs(process.argv.slice(2));
main(args);
