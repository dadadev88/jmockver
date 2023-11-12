# JMockver

Is a library to create a JSON mock server, only need JSON files

## How to use?

* Run command ```npm i jmockver -D``` to install as dev dependency
* Create folder **mocks/** in your root project, can change with **dir** argument (Ex. jmockver --dir api)
* Into mocks/ folder create JSON files that you need, can create multiple files with any name.
* JSON files must be created with following template

```jsonc
{
  // URL endpoint to serve
  "/your-path/users": {
    // Method to create on endpoint, can create GET, POST, PUT, PATCH and DELETE
    "GET": {
      // Code to response, this is finded into responses property
      "codeToResponse": "RESP001",
      // Array with your multiple response, can create that the ones you need
      "responses": [
        {
          // Code for match with codeToResponse property
          "code": "RESP001",
          // Status code to return on response (200, 201, 400, 401, 500 etc etc)
          "statusCode": 200,
          // Body to return on response, can to be anything valid JSON response
          "body": []
        },
        {
          // Code for match with codeToResponse property
          "code": "R002",
          // Status code to return on response
          "statusCode": 201,
          // Body to return on response, can to be anything valid JSON response
          "body": []
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
    // You can change port to server (default 3000) or mock folder directory (default mocks/)
    "jmockver": "jmockver --port 3201 --dir mocks"
  }
}
```

* Run script ```npm run jmockver```, and you can see all readed JSON files with routes detail.

Example:

```bash
[JMockVer] ✅  Starting
[JMockVer] 👁️  Searching JSON mock files in "mocks" dir

[JMockVer] 🗂️  Routes on file sales.json
[JMockVer] 🚦 Creating route GET - /sales/by-user/1
[JMockVer] 🚦 Creating route PUT - /sales/by-user/1
[JMockVer] 🚦 Creating route POST - /sales/by-user/1
[JMockVer] 🚦 Creating route PUT - /sales/by-user/1/change-password

[JMockVer] 🗂️  Routes on file users.json
[JMockVer] 🚦 Creating route GET - /users/all
[JMockVer] 🚦 Creating route PUT - /users/all
[JMockVer] 🚦 Creating route DELETE - /users/all

[JMockVer] ✅ Run on port 3201
```

If you set a **codeToResponse** with a code than not exists on **responses** list, this route will not be serve and you see the following message

Example:
```bash
[JMockVer] ❌ Response with code RESP001 not found on GET /sales/by-user/1
```

You can install globally to use **jmockver** from anywhere path.

```bash
npm install jmockver -g
```
