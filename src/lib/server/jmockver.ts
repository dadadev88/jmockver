import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { networkInterfaces } from 'node:os';
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
    const customMorganFormat = '[JMockver] ➡️  :method :url :status - :response-time ms\n';
    this.app.use(morgan(customMorganFormat));

    const staticDir = join('./', this.cliArgs.staticDir ?? JMockverConstants.STATIC_DIR_DEFAULT);
    this.app.use(JMockverConstants.STATIC_SERVE_DIR, express.static(staticDir));
    LoggerUtil.info(`🗂️  Serving static files from "${staticDir}" dir`);
  }

  async run(): Promise<void> {
    const dirArg = this.cliArgs.dir ?? JMockverConstants.MOCKS_DIR_DEFAULT;
    const mocksFolder = join('./', dirArg);

    if (!existsSync(mocksFolder)) {
      mkdirSync(mocksFolder, { recursive: true });
      LoggerUtil.info(`🗂️ Directory "${mocksFolder}" created`);
    }

    LoggerUtil.info(`🔎 Searching JSON mock files in "${mocksFolder}" dir`);

    const fileUtils = new JMockverFileUtils();
    const files = await fileUtils.getJSONFilenames(mocksFolder);

    if (files.length === 0) {
      LoggerUtil.jumpLine();
      LoggerUtil.info(`❌ No mock files found in "${mocksFolder}" dir. If your mock files are in other directory, use --dir argument to change the directory.`);
      LoggerUtil.info(`💡 Can create an example file with "npx jmockver-gen"`);
      LoggerUtil.info(`📕 See examples in https://github.com/dadadev88/jmockver/tree/master/examples`);
      return;
    }

    const routesUtils = new JMockverRoutesUtils(this.app);
    await routesUtils.generateRoutesFromJSONFiles(mocksFolder, files);

    const port = this.cliArgs.port ?? JMockverConstants.APP_PORT_DEFAULT;
    const host = this.cliArgs.host ?? JMockverConstants.APP_HOST_DEFAULT;
    this.app.listen(port, host, () => {
      this.logAfterServerStart(host, port);
    });
  }

  private logAfterServerStart(host: string, port: number): void {
    LoggerUtil.jumpLine();
    const hostToDisplay = host === '0.0.0.0' ? 'localhost' : host;
    LoggerUtil.info(`✅ Mock server running on http://${hostToDisplay}:${port}`);
    if (host === '0.0.0.0') {
      const localIp = Object.values(networkInterfaces())
        .flat()
        .filter((details) => details?.family === 'IPv4' && !details.internal)
        .map((details) => details?.address)
        .shift();
      LoggerUtil.info(`🌐 Accessible in your network on http://${localIp}:${port}`);
    }
    LoggerUtil.info(`🗂️  Static server running on http://${hostToDisplay}:${port}${JMockverConstants.STATIC_SERVE_DIR}`);
    LoggerUtil.info(`👁️  See all routes in http://${hostToDisplay}:${port}/jmockver/routes`);
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
