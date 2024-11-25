import { existsSync } from 'node:fs';
import { join } from 'node:path';
import CLIargs from 'minimist';
import { LoggerUtil } from '../utils/logger.util';
import { readFile, writeFile } from 'node:fs/promises';

class JMockverGenerator {

  constructor(private readonly cliArgs: CLIargs.ParsedArgs) {
    this.cliArgs = cliArgs;
  }

  public async generate(): Promise<void> {
    const dirArg = this.cliArgs.dir ?? 'mocks';
    const mocksDirectory = join('./', dirArg);
    const haveToInsertComments = !!this.cliArgs.comments;
    const filename = haveToInsertComments ? 'jmockver-example.jsonc' : 'jmockver-example.json';

    this.validateMocksDirectory(mocksDirectory, filename);

    const templatePath = join(__dirname, '../templates/' + filename)
    const fileContent = await readFile(templatePath, { encoding: 'utf-8' });
    await writeFile(join(mocksDirectory, filename), fileContent);

    this.logAfterGenerateExample(filename, mocksDirectory, haveToInsertComments);
  }

  private validateMocksDirectory(mocksDirectory: string, filename: string): void {
    if (!existsSync(mocksDirectory)) {
      LoggerUtil.info(`❌ Don't exists "${mocksDirectory}/" folder, create it or change --dir argument`);
      LoggerUtil.info(`ℹ️ Run with --help argument to get more information`);
      process.exit(1);
    }

    const fileExists = existsSync(join(mocksDirectory, filename));
    if (fileExists) {
      LoggerUtil.info(`❌ File ${filename} already exists in "${mocksDirectory}/" folder, please change the name or delete it`);
      process.exit(1);
    }
  }

  private logAfterGenerateExample(filename: string, mocksFolder: string, haveInsertComments: boolean) {
    LoggerUtil.info(`🗂️ JMockver example file "${filename}" created in "${mocksFolder}" folder`);
    LoggerUtil.info(`💡 You can change filename and edit content with your requirements\n`);

    if (haveInsertComments) {
      LoggerUtil.info(`NOTE: after edit it please remove comments and rename filename to change extension from ".jsonc" to ".json"`);
      LoggerUtil.info(`Comments are only for help you and this will generate an error when run JMockver`);
    } else {
      LoggerUtil.info('NOTE: if you want to add comments to your JSON file, please add --comments argument');
    }
  }
}

const args = CLIargs(process.argv.slice(2));

if (args.help) {
  LoggerUtil.generatorHelp();
  process.exit(0);
} else {
  const generator = new JMockverGenerator(args);
  generator.generate();
}
