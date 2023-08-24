require 'webrick'

default_port = 3000

# Get the port from the command line arguments
port = ARGV[0] ? ARGV[0].to_i : default_port

server = WEBrick::HTTPServer.new(
  Port: port,
  Logger: WEBrick::Log::new("/dev/null"),   # Disable general logging
  AccessLog: [],                            # Disable access logging
  StartCallback: proc {
    server.listeners.each do |s|
      s.setsockopt(:SOCKET, :REUSEPORT, 1)
    end
  }
)

server.mount_proc '/' do |req, res|
  res.body = '1'
  res['Content-Type'] = 'text/plain'
end

# Handle signals for graceful shutdown
trap 'INT' do server.shutdown end
trap 'TERM' do server.shutdown end

server.start
