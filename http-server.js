import { createServer } from "http"

export default (port = 3000) => {
  const server = createServer((req, res) => {
    res.writeHead(200, null, { "Content-type": "text/plain" })
    res.end("1")
  }).listen(port)

  console.info("Started HTTP server on port", port)

  return () => server.close()
}
