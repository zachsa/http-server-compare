export default {
  BASE_PORT: 12100,
  TESTS: [1, 4, 16, 200],
  REPS: 4,
  WARMUP_DELAY: 1000,
  SERVERS: [
    {
      "#": "Very inefficient and clearly slow. Not worth substantial testing",
      type: "python",
      command: "python",
      args: ["./servers/python/http-server.py"],
      name: "Python HTTP Server",
      testLimit: 8,
      protocol: "http",
    },
    {
      "#": "Very inefficient and clearly slow. Not worth substantial testing",
      type: "python",
      command: "python",
      args: ["./servers/python/https-server.py"],
      name: "Python HTTPS Server",
      testLimit: 8,
      protocol: "https",
    },
    {
      type: "python",
      command: "python",
      args: ["./servers/python/http-async.py"],
      name: "Python HTTP Async Server",
      protocol: "http",
    },
    {
      type: "python",
      command: "python",
      args: ["./servers/python/http-async-uvloop.py"],
      name: "Python HTTP Async (uvloop) Server",
      protocol: "http",
    },
    {
      type: "python",
      command: "python",
      args: ["./servers/python/https-async.py"],
      name: "Python HTTPS Async Server",
      protocol: "https",
    },
    {
      type: "node",
      command: "node",
      args: ["./servers/nodejs/http-server.js"],
      name: "Node HTTP Server",
      protocol: "http",
    },
    {
      type: "node",
      command: "node",
      args: ["./servers/nodejs/https-server.js"],
      name: "Node HTTPS Server",
      protocol: "https",
    },
  ],
}
