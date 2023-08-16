from aiohttp import web
import sys
import asyncio
import ssl

defaultPort = 3000

# Get the port from the command line arguments
port = int(sys.argv[1]) if len(sys.argv) > 1 else defaultPort

async def handle(request):
    return web.Response(text="1")

async def init_app():
    app = web.Application()
    app.router.add_get('/', handle)
    return app

async def run():
    app = await init_app()
    runner = web.AppRunner(app)
    await runner.setup()

    # Create an SSL context
    ssl_context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
    ssl_context.load_cert_chain('cert.pem', 'key.pem')

    site = web.TCPSite(runner, '0.0.0.0', port, ssl_context=ssl_context, reuse_address=True)
    print(f"Started HTTPS server on port {port}")
    await site.start()

    # Keep the loop running
    while True:
        await asyncio.sleep(0)

loop = asyncio.get_event_loop()
loop.run_until_complete(run())
try:
    loop.run_forever()
except KeyboardInterrupt:
    pass
