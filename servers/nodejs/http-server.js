import { createServer } from "http"

const defaultPort = 3000

// Get the port from the command line arguments
const port = process.argv[2] || defaultPort

const server = createServer((req, res) => {
  res.writeHead(200, { "Content-type": "text/plain" })
  res.end("1")
})

// Using exclusive: false allows port to be shared and reused
server.listen(port, {
  exclusive: false,
})
