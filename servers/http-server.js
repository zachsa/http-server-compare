import { createServer } from "http"

const defaultPort = 3000

// Get the port from the command line arguments
const port = process.argv[2] || defaultPort

const server = createServer((req, res) => {
  res.writeHead(200, { "Content-type": "text/plain" })
  res.end("1")
}).listen(port)

console.info("Started HTTP server on port", port)
