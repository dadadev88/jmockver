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
    const dirArg = this.cliArgs.dir ?? 'jmockver';
    const mocksDirectory = join('./', dirArg);
    const ramdonNumber = Math.floor(Math.random() * 1000000);
    const filename = 'jmockver-example.template';

    this.validateMocksDirectory(mocksDirectory);

    const templatePath = join(__dirname, '../templates/' + filename);
    const fileContent = await readFile(templatePath, { encoding: 'utf-8' });
    const ramdonFilename = ramdonNumber + '-' + filename;
    const newFilePath = join(mocksDirectory, ramdonFilename.replace('.template', `.json`));
    await writeFile(newFilePath, fileContent);

    this.logAfterGenerateExample(newFilePath);
  }

  private validateMocksDirectory(mocksDirectory: string): void {
    if (!existsSync(mocksDirectory)) {
      LoggerUtil.info(`❌ Don't exists "${mocksDirectory}/" folder, create it or change --dir argument`);
      LoggerUtil.info(`ℹ️ Run with --help argument to get more information`);
      process.exit(1);
    }
  }

  private logAfterGenerateExample(templatePath: string) {
    LoggerUtil.info(`🗂️ JMockver example file created in "${templatePath}"`);
    LoggerUtil.info(`💡 You can change filename and edit content with your requirements\n`);
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
