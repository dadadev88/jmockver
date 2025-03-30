# JMockver
Run a mock server with JSON files, all you need is know work with JSON files.

JMockver is a command-line tool that helps developers work independently by simulating server responses. Very useful to start a mock server in some minutes, without need to write any code, only need to know the responses structure and set it in a JSON file.

You have total control to set any response body, sleep time to simulate response time, change response headers and more.

## How to use?
* Run command `npm i jmockver -D` to install as dev dependency
* Create **mocks/** folder in your project root, can change and set with **--dir** argument.
* Generate a JMockver file example, run `npx jmockver-gen` (need install jmockver previously).

Enter here to see JMockver files examples [https://github.com/dadadev88/jmockver/tree/master/examples](https://github.com/dadadev88/jmockver/tree/master/examples).

The changes in the files are automatically reflected in the mock server, so you can apply any changes in the files and see the changes in the mock server.

After generate JMockver files, you can create a script in your package.json to run mock server and generate files easily.

```jsonc
{
  "scripts": {
    "mock": "jmockver", // Run with --help to see all arguments
    "mock-gen": "jmockver-gen" // Run with --help to see all arguments
  }
}
```

* Run script ```npm run mock``` or if not create a script ```npx jmockver```, and you can see all readed JMockver files with routes detail.
  Example:

```bash
[JMockver] 🧰 Running JMockver with default arguments. Run with --help to see all arguments
[JMockver] 🔎 Searching JSON mock files in "mocks" dir

[JMockver] 🗂️  Routes in 505213-jmockver-example.json file
[JMockver]      🚦 Creating mock /api/v1/users - GET
[JMockver]      🚦 Creating mock /api/v1/users - POST
[JMockver]      🚦 Creating mock /api/v1/users/100 - GET
[JMockver]      🚦 Creating mock /api/v1/users/100 - PUT

[JMockver] 🗂️  Routes in 821989-jmockver-example.json file
[JMockver]      🚦 Creating mock /api/v1/products - GET
[JMockver]      🚦 Creating mock /api/v1/products - POST
[JMockver]      🚦 Creating mock /api/v1/products/100 - GET
[JMockver]      🚦 Creating mock /api/v1/products/100 - PUT

[JMockver] ✅ Mock server running on http://localhost:3000 or http://127.0.0.1:3000
[JMockver] 👁️ See all routes in http://localhost:3000/jmockver/routes
```

If exists an error to serve a route, you will see a similar message to this:

Example:

```bash
[JMockver]      ❌ JMockverResponseIdNotMatchedError: Response with code RESP00 not found on POST /api/v1/products
```

