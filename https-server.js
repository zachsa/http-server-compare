import { createServer } from "https"
import { readFileSync } from "fs"

// Read the SSL certificate files
const privateKey = readFileSync("./key.pem", "utf8")
const certificate = readFileSync("./cert.pem", "utf8")

export default (port = 3000) => {
  const server = createServer(
    { key: privateKey, cert: certificate },
    (req, res) => {
      res.writeHead(200, null, { "Content-type": "text/plain" })
      res.end("1")
    }
  ).listen(port)

  console.info("Started HTTPS server on port", port)

  return () => server.close()
}
