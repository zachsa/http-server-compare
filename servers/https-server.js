import { createServer } from "https"
import { readFileSync } from "fs"

// Read the SSL certificate files
const privateKey = readFileSync("./key.pem", "utf8")
const certificate = readFileSync("./cert.pem", "utf8")

const defaultPort = 3000

// Get the port from the command line arguments
const port = process.argv[2] || defaultPort

const server = createServer(
  { key: privateKey, cert: certificate },
  (req, res) => {
    res.writeHead(200, { "Content-type": "text/plain" })
    res.end("1")
  }
)

// Using exclusive: false allows port to be shared and reused
server.listen(port, {
  exclusive: false,
})
