export class LoggerUtil {
  private static readonly prefix = '[JMockver]';

  public static info(text: string) {
    console.log(`${this.prefix} ${text}`);
  }
  public static help() {
    console.log(`
    ${this.prefix} 🚀 Run a mock server with JSON files, customize the response body and status code, all with JSON

    ${this.prefix} ⚙️ Options:

      --port: Port to run the server on. Default: 3000
      --dir: Directory to search for JSON mock files. Default: ./mocks
      --logger: Enable logger. Default: false
      --loggerFormat: Logger format. Default: tiny
      --help: Show this help message

    ${this.prefix} 💡 Example:

      Run with default options:
        npx jmockver

      Run on port 8080:
        npx jmockver --port=8080

      Run with custom mocks directory:
        npx jmockver --dir=./my-mocks

      Run with logger enabled:
        npx jmockver --logger=true

      Run with logger enabled and custom format:
        npx jmockver --logger=true --loggerFormat="dev"
    `);
  }
}
