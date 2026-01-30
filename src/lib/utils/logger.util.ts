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
++++${this.prefix} 🚀 Run a mock server with JSON files, customize the response body and status code, also serve static files.

++++⚙️  Options:

++++  --port:         Port to run the server on. Default: 3000

++++  --host:         Host to run the server on. Default: localhost
++++                  If you want to allow access from other devices in your network, use 0.0.0.0

++++  --dir:          Directory to search for JSON mock files. Default: ./jmockver

++++  --staticDir:    Directory to search static files. Default: ./jmockver/static
++++                  The static files will be served on /static path. Ex.: /static/styles.css o /static/images/logo.png

++++  --help:         Show this help message

++++💡 Example:

++++  Run with default options:
++++    npx jmockver

++++  Run on port 8080 and host 0.0.0.0 (accessible in your network):
++++    npx jmockver --port=8080 --host=0.0.0.0

++++  Run with custom directories for mock files and static files:
++++    npx jmockver --dir=./mocks/api --staticDir=./mocks/static

++++  You can combine all options (except --help):
++++`.replaceAll('++++', ''));
  }

  public static generatorHelp(): void {
    console.log(`
++++${this.prefix} 🗂️ JMockverGenerator help you to create a JMockver example file

++++⚙️ Options:

++++  --dir: Directory to create the file. Default: ./jmockver
++++  --help: Show this help message

++++💡 Example:

++++  Create a file in default directory:
++++    npx jmockver-generator

++++  Create a file in custom directory:
++++    npx jmockver-generator --dir=./mocks
++++`.replaceAll('++++', ''));
  }
}
