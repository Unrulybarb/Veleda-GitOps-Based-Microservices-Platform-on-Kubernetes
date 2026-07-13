const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("user service running\n");
});

server.listen(3000, () => {
  console.log("user service running on port 3000");
});