const http = require("http");
const axios = require("axios");

const server = http.createServer(async (req, res) => {
  if (req.url === "/health") {
    return res.end("ok");
  }

  if (req.url === "/users") {
    try {
      const response = await axios.get("http://user-service");
      return res.end("auth -> user-service says: " + response.data);
    } catch (err) {
      return res.end("user-service unreachable");
    }
  }

  res.end("auth service running");
});

server.listen(3000, () => {
  console.log("auth service running on port 3000");
});