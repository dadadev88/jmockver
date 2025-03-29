# JMockver examples

### One mock url
You can create a mock for a single url with multiple methods. See [one-mock-url.jmockver.json](./one-mock-url.json)

### Multiple mock urls
You can create a mock for multiple urls. See [multiple-mock-urls.json](./multiple-mock-urls.json)

### JMockver schema
You can use the JMockver schema to get autocompletion and type safety. You set the `$schema` property into JSON Mock files with value `https://raw.githubusercontent.com/dadadev88/jmockver/master/jmockver-schema.json` (you can see in example files)

Also, you can download the schema file and import into your editor to get autocompletion and type safety.

#### VSCode example, add this into main object of your settings.json
```jsonc
"json.schemas": [
  {
    // Match all files with the .jmockver.json extension
    "fileMatch": ["*.jmockver.json"],
    // Use the schema file from URL
    "url": "https://raw.githubusercontent.com/dadadev88/jmockver/master/jmockver-schema.json"
  }
]
```

