# JMockver
Run a mock server with JSON files, create a single JSON file to simulate a server response.

JMockver is a command-line tool that helps developers work independently by simulating server responses. Very useful to start a mock server in some minutes, without need to write any code, only need to know the responses structure and set it in a JSON file.

You have total control to set any response body, sleep time to simulate response time, change response headers, HTTP status code and more.

Also can serve static files from a directory with the same command-line, by default serves from path `./static` folder.

## How to use?
1. Install JMockver with
  ```bash
  npm i jmockver -D
  ```
2. Generate a JMockver file example (need install jmockver previously).
  ```bash
  npx jmockver-gen
  ```
3. Run mock server with default arguments.
  ```bash
  npx jmockver
  ```

## CLI Arguments
```bash
npx jmockver --help
```

```plaintext
🚀 Run a mock server with JSON files, customize the response body and status code, also serve static files.

⚙️  Options:

  --port:         Port to run the server on. Default: 3000
  --host:         Host to run the server on. Default: localhost
                  If you want to allow access from other devices in your network, use 0.0.0.0
  --dir:          Directory to search for JSON mock files. Default: ./jmockver
  --staticDir:    Directory to search static files. Default: ./jmockver/static
                  The static files will be served on /static path. Ex.: /static/styles.css o /static/images/logo.png
  --help:         Show this help message

💡 Example:

  Run with default options:
    npx jmockver
  Run on port 8080 and host 0.0.0.0 (accessible in your network):
    npx jmockver --port=8080 --host=0.0.0.0
  Run with custom directories for mock files and static files:
    npx jmockver --dir=./mocks/api --staticDir=./mocks/static
  You can combine all options (except --help):
```

Edit the generated example file with your routes and responses. When edit the file and save, the changes are automatically reflected in the mock server.

Enter here to see JMockver files examples [https://github.com/dadadev88/jmockver/tree/master/examples](https://github.com/dadadev88/jmockver/tree/master/examples).

You can create scripts in your package.json to run mock server and generate files easily.

```jsonc
{
  "scripts": {
    "mock": "jmockver", // Run mock server with default arguments, use --help to see all arguments
    "mock-gen": "jmockver-gen" // Run with --help to see all arguments
  }
}
```

After run JMockver, you can see all readed JMockver files with routes detail and static files path.
```bash
[JMockver] 🧰 Running JMockver with default arguments. Run with --help to see all arguments
[JMockver] 🗂️  Serving static files from "jmockver/static" dir
[JMockver] 🔎 Searching JSON mock files in "jmockver" dir

[JMockver] ➡️  Routes in 229699-jmockver-example.json file
[JMockver]      🚦 Creating mock /api/v1/products/:id - GET
[JMockver]      🚦 Creating mock /api/v1/products/:id - POST
[JMockver]      🚦 Creating mock /api/v1/products/:productId/images - GET
[JMockver]      🚦 Creating mock /api/v1/products/:productId/images/:imageId - GET

[JMockver] ✅ Mock server running on http://localhost:3000
[JMockver] 🗂️  Static server running on http://localhost:3000/static
[JMockver] 👁️  See all routes in http://localhost:3000/jmockver/routes
```
When a route is called, you will see a log like this:
```bash
[JMockver] ⤵️  Route called with path params: {"productId":"lasd-2asd","imageId":"123.jp"}
[JMockver] ➡️  GET /api/v1/products/lasd-2asd/images/123.jp 304 - 4.414 ms
[JMockver] ⤵️  Route called with path params: {"productId":"lasd-2asd","imageId":"123.jp"}
[JMockver] ➡️  GET /api/v1/products/lasd-2asd/images/123.jp 304 - 2.016 ms
[JMockver] ➡️  GET /jmockver/routes 200 - 3.556 ms
[JMockver] ➡️  GET /static/js/index.js 304 - 2.766 ms
```

Also, you can see all routes into a Web UI in `/jmockver/routes`. This looks like this:

![JMockver Routes](https://raw.githubusercontent.com/dadadev88/jmockver/master/docs/jmockver-routes-web-ui.png)

If exists an error to serve a route, you will see a message like this:

```bash
[JMockver]      ❌ JMockverResponseIdNotMatchedError: Response with code RESP00 not found on "/api/v1/products - POST" route
[JMockver]      ❌ JMockverRouteAlreadyExistsError: Route "/api/v1/products - POST" already exists on "505213-jmockver-example.json" file
[JMockver]      ❌ JMockverStatusCodeNotValidError: Status code 600 is not valid, in "/api/v1/products - POST" route
```

