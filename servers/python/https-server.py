import http.server
import ssl
import sys
import socket
import signal

def shutdown(*args):
    raise SystemExit

signal.signal(signal.SIGTERM, shutdown)
signal.signal(signal.SIGINT, shutdown)

defaultPort = 4000

# Get the port from the command line arguments
port = int(sys.argv[1]) if len(sys.argv) > 1 else defaultPort

class MyHTTPSServer(http.server.HTTPServer):
    def server_bind(self):
        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        super().server_bind()

class MySimpleHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/plain")
        self.end_headers()
        self.wfile.write(b"1")

    # Override this method to disable the default logging
    def log_message(self, format, *args):
        return

# Set up the SSL context using the key and cert files
context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain(certfile='./ssl/cert.pem', keyfile='./ssl/key.pem')

# Specify to use only TLS 1.3
context.minimum_version = ssl.TLSVersion.TLSv1_3
context.maximum_version = ssl.TLSVersion.TLSv1_3

httpd = MyHTTPSServer(('', port), MySimpleHTTPRequestHandler)
httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
httpd.serve_forever()
