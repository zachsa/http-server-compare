import uvloop
import asyncio
from aiohttp import web
import sys
import signal
import ssl

asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())

port = int(sys.argv[1]) if len(sys.argv) > 1 else 3000

async def handle(request):
    return web.Response(text="1")

def shutdown(*args):
    raise SystemExit

signal.signal(signal.SIGTERM, shutdown)
signal.signal(signal.SIGINT, shutdown)

# Create an SSL context
ssl_context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
ssl_context.load_cert_chain(certfile='ssl/cert.pem', keyfile='ssl/key.pem')

# Specify to use only TLS 1.3
ssl_context.minimum_version = ssl.TLSVersion.TLSv1_3
ssl_context.maximum_version = ssl.TLSVersion.TLSv1_3

app = web.Application()
app.router.add_get('/', handle)
web.run_app(app, host='0.0.0.0', port=port, reuse_address=True, print=lambda *args: None, ssl_context=ssl_context)
