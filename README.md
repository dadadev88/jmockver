# JMockver

Are you developing your frontend application and even the backend team is not deploying the changes for your tests? You can use this tool to simulate server responses, you just need to create a simple JSON file to simulate all the possible use cases of your application. You can use it to connect with your frontend web application (Angular, React, Vue, etc etc) or with your mobile application (React Native, Ionic, Flutter, Swift, etc etc).

It is important to mention that no type of validation is carried out with the requests received, you can have multiple responses on an endpoint and only change the response id with the desired response.

NOTE: you will not have CORS problems since it allows requests from any origin.

## CLI arguments
```
--dir             Folder to find JSON files. Default mocks/ in project root.
--port            Port number to run server. Default 3000
--logger          Enable to see HTTP request on console. Default false
--loggerFormat    Set a valid format to morgan package (https://www.npmjs.com/package/morgan). Default tiny
```
## How to use?

* Run command ```npm i jmockver -D``` to install as dev dependency
* Create **mocks/** folder in your project root, can change and set with **--dir** argument.
* Into mocks/ folder create JSON files that you need, can create multiple files with any name.
* JSON files must be created with following template

```jsonc
{
  // URL endpoint to serve
  "/your-path/users": {
    // Method to create on endpoint, can create GET, POST, PUT, PATCH and DELETE
    // NOTE: it is not require declare all methods, only those you need
    "GET": {
      // Code to response, this is finded into responses property
      "responseIdToReturn": "RESP001",
      // Array with your multiple response, can create that the ones you need
      "responses": [
        {
          // Response id, for match with responseIdToReturn property
          "id": "RESP001",
          // Status code to return on response (200, 201, 400, 401, 500 etc etc). Default 200
          "statusCode": 200,
          // Body to return on response, can to be any valid JSON response (object, list, etc etc)
          "body": []
        },
        // Another response, you can create multiple responses into list (responses property).
        // It will be return response that made match with responseIdToReturn property
        {
          "id": "R002",
          "statusCode": 201,
          "body": {}
        },
      ]
    },
    "POST": { }, // Use same JSON config than GET method example
    "PUT": { }, // Use same JSON config than GET method example
    "PATCH": { }, // Use same JSON config than GET method example
    "DELETE": { } // Use same JSON config than GET method example
  }
}
```
* After create JSON files, create a script in your package.json
```jsonc
{
  "scripts": {
    // You can send args to change default values
    "mock": "jmockver"
  }
}
```
* Run script ```npm run mock```, and you can see all readed JSON files with routes detail.
Example:
```bash
[JMockVer] ✅ Starting on port 3000
[JMockVer] 🔎 Searching JSON mock files in "mocks" dir
[JMockVer] 🗂️ Routes on file sales.json
[JMockVer] 🚦 Creating route GET - /sales/by-user/1
[JMockVer] 🚦 Creating route PUT - /sales/by-user/1
[JMockVer] 🚦 Creating route POST - /sales/by-user/1
[JMockVer] 🚦 Creating route PUT - /sales/by-user/1/change-password
[JMockVer] 🗂️ Routes on file users.json
[JMockVer] 🚦 Creating route GET - /users/all
[JMockVer] 🚦 Creating route PUT - /users/all
[JMockVer] 🚦 Creating route DELETE - /users/all
[JMockVer] ✅ Run on port 3201
```
If you set a **responseIdToReturn** with a code than not exists on **responses** list, this route will not be serve and you will see a similar message to this:

Example:
```bash
[JMockVer] ❌ Response with code RESP001 not found on GET /sales/by-user/1
```

You can install globally with `npm i jmockver -g` to use **jmockver** from anywhere path or project, consider that it always requires finding the mocks folder.
