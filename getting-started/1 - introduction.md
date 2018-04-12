# Getting Started with Node.js

You've probably already heard that Node excels at building scalable servers.
But what really sets Node apart is that it does so while still being an
incredibly easy platform to get started with. In fact, let's do that right
now and begin exploring Node's capabilities. In the editor below you'll
a simple "Hello World" app &mdash; go ahead and change the code, it's
**running live** and you'll see the updates automatically on the right!


```js runkit title=simple.js
const http = require("http");

// Create a server that always returns "Hello World!".
const server = http.createServer((req, res) => {
  res.end("Hello World!");
});

// Start the server
server.listen(8000, () => {
  console.log("Server started on port 8000!");
});
```
