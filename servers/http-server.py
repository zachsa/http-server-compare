import http.server
import socketserver
import sys
import socket

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

# Create a TCPServer instance without binding or activating
httpd = socketserver.TCPServer(("", port), Handler, bind_and_activate=False)

# Set the socket option to reuse the address
httpd.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

# Now bind and activate the server
httpd.server_bind()
httpd.server_activate()
httpd.serve_forever()
