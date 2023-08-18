from aiohttp import web
import sys
import signal
import ssl

port = int(sys.argv[1]) if len(sys.argv) > 1 else 3000

async def handle(request):
    return web.Response(text="1")

def shutdown(*args):
    raise SystemExit

signal.signal(signal.SIGTERM, shutdown)
signal.signal(signal.SIGINT, shutdown)

ssl_context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
ssl_context.load_cert_chain('cert.pem', 'key.pem')

app = web.Application()
app.router.add_get('/', handle)
web.run_app(app, host='0.0.0.0', port=port, ssl_context=ssl_context, reuse_address=True, print=lambda *args: None)
