require 'webrick'
require 'webrick/https'

default_port = 3000

# Get the port from the command line arguments
port = ARGV[0] ? ARGV[0].to_i : default_port

server = WEBrick::HTTPServer.new(
  Port: port,
  Logger: WEBrick::Log::new("/dev/null"),   # Disable general logging
  AccessLog: [],                            # Disable access logging
  SSLEnable: true,
  SSLCertificate: OpenSSL::X509::Certificate.new(File.open(File.join("ssl", "cert.pem")).read),
  SSLPrivateKey: OpenSSL::PKey::RSA.new(File.open(File.join("ssl", "key.pem")).read),
  SSLVersion: 'TLSv1_3',                     # Specify to use only TLS 1.3
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
