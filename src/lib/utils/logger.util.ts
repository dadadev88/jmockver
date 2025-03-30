export class LoggerUtil {
  private static readonly prefix = '[JMockver]';

  public static info(text: string) {
    console.log(`${this.prefix} ${text}`);
  }

  public static jumpLine() {
    console.log('');
  }

  public static help() {
    console.log(`
++++${this.prefix} 🚀 Run a mock server with JSON files, customize the response body and status code, all with JSON

++++⚙️ Options:

++++  --port: Port to run the server on. Default: 3000
++++  --dir: Directory to search for JSON mock files. Default: ./mocks
++++  --loggerFormat: Logger format. Default: tiny
++++  --help: Show this help message

++++💡 Example:

++++  Run with default options:
++++    npx jmockver

++++  Run on port 8080:
++++    npx jmockver --port=8080

++++  Run with custom mocks directory:
++++    npx jmockver --dir=./my-mocks

++++  Run with logger custom format (Based on morgan package. Some formats: dev, short, tiny, common, combined):
++++    npx jmockver --loggerFormat="dev"
++++`.replaceAll('++++', ''));
  }

  public static generatorHelp(): void {
    console.log(`
++++${this.prefix} 🗂️ JMockverGenerator help you to create a JMockver example file

++++⚙️ Options:

++++  --dir: Directory to create the file. Default: ./mocks
++++  --help: Show this help message

++++💡 Example:

++++  Create a file in default directory:
++++    npx jmockver-generator

++++  Create a file in custom directory:
++++    npx jmockver-generator --dir=./my-mocks
++++`.replaceAll('++++', ''));
  }
}
