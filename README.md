# JMockver
Run a mock server with JSON files, customize the response body and status code, all with JSON

JMockver is a command-line tool that helps developers work independently by simulating server responses, usefull for frontend developers when the API development is not completed, only you need to now the responses structure to set this in a JSON files. It allows you to create a mock server that mimics the behavior of a real API, returning predefined data and responding to various HTTP requests. You can set any allow response body, sleep time to simulate response time, change response headers and more. You can intergrate to your fronted, mobile or backend app.

It is important to mention that no type of validation is carried out with the requests received, you can have multiple responses on an endpoint and only change the response id with the desired response.

NOTE: you will not have CORS problems since it allows requests from any origin.

## CLI arguments

```
--dir             Folder to find JSON files. Default mocks/ in project root.
--port            Port number to run server. Default 3000
--logger          Enable to see HTTP request on console. Default false
--loggerFormat    Set a valid format to morgan package. Default tiny
```
To see Morgan package detail, click [here](https://www.npmjs.com/package/morgan)

## How to use?
* Run command ```npm i jmockver -D``` to install as dev dependency
* Create **mocks/** folder in your project root, can change and set with **--dir** argument.
* Into mocks/ folder create JSON files that you need (ex. users.json), can create multiple files with any name.
* JSON files must be created with following template (should remove comments line in final JSON file)

```jsonc
{
  // URL endpoint to serve
  "/api/v1/users": {
    // Method to create on endpoint, can create GET, POST, PUT, PATCH and DELETE
    // NOTE: it is not require declare all methods, only those you need
    "GET": {
      "responseIdToReturn": "RESP001", // ID to response, this is finded into responses id property
      "sleep": 1000, // Sleep time, useful to simulate response time
      // Array with your multiple responses, can create that the ones you need
      "responses": [
        {
          "id": "RESP001", // Response id, for match with responseIdToReturn property
          "statusCode": 200, // Status code to return on response (200, 201, 400, 401, 500 etc etc). Default 200
          "body": [] // Body to return on response, can to be any valid JSON response (object, list, etc etc)
        },
        // You can create multiple responses into same responses property
        // Only need to change responseIdToReturn property with response ID that you want return
        { "id": "RESP002", "statusCode": 201, "body": {} },
        { "id": "RESP404", "statusCode": 404, "body": "Not found" }
        { "id": "RESP404", "statusCode": 500, "body": "Server error" }
      ]
    }
  }
}
```

Enter here to see another examples JSON files [https://github.com/dadadev88/jmockver/tree/master/examples](https://github.com/dadadev88/jmockver/tree/master/examples)

* After create JSON files, create a script in your package.json

```jsonc
{
  "scripts": {
    "mock": "jmockver" // You can add args to change default values
  }
}
```

* Run script ```npm run mock``` or if not create a script ```npx jmockver```, and you can see all readed JSON files with routes detail.
  Example:

```bash
[JMockver] ✅ Starting server on port 3000
[JMockver] 🧰 Run with arguments {"logger":true}
[JMockver] 🔎 Searching JSON mock files in "mocks" dir
[JMockver] 🗂️  Routes in products-v1.json file
[JMockver]   🚦 Creating mock /api/v1/products - GET
[JMockver]   🚦 Creating mock /api/v1/products/prd001 - GET
[JMockver]   🚦 Creating mock /api/v1/products/prd001 - DELETE
[JMockver] 🗂️  Routes in users-v1.json file
[JMockver]   🚦 Creating mock /api/v1/users - GET
[JMockver]   🚦 Creating mock /api/v1/users/1 - PUT
[JMockver]   🚦 Creating mock /api/v1/users/1 - POST
[JMockver]   🚦 Creating mock /api/v1/users/1 - DELETE
[JMockver] ✅ Server running on port 3000
```

If you set a **responseIdToReturn** with an id than not exists on **responses** list, this route will not be serve and you will see a similar message to this:

Example:

```bash
[JMockVer] ❌ Response with code RESP001 not found on GET /api/v1/users/3322
```

You can install globally with `npm i jmockver -g` to use **jmockver** from anywhere path or project, consider that it always requires finding the mocks folder.
