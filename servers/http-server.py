import http.server
import socketserver
import sys

defaultPort = 3000

# Get the port from the command line arguments
port = int(sys.argv[1]) if len(sys.argv) > 1 else defaultPort

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/plain")
        self.end_headers()
        self.wfile.write(b"1")

    # Override this method to disable the default logging
    def log_message(self, format, *args):
        return

Handler = MyHttpRequestHandler

with socketserver.TCPServer(("", port), Handler) as httpd:
    print(f"Started HTTP server on port {port}")
    httpd.serve_forever()
