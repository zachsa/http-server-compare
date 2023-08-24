require 'eventmachine'
require 'em-http-server'

default_port = 3000

# Get the port from the command line arguments
port = ARGV[0] ? ARGV[0].to_i : default_port

class MyHttpServer < EM::HttpServer::Server
  def process_http_request
    response = EM::DelegatedHttpResponse.new(self)
    response.status = 200
    response.content_type 'text/plain'
    response.content = '1'
    response.send_response
  end
end

EM.run do
  EM.start_server("0.0.0.0", port, MyHttpServer)

  # Handle signals for graceful shutdown
  Signal.trap('INT')  { EM.stop }
  Signal.trap('TERM') { EM.stop }
end
