import os
from decouple import config
from django.core.asgi import get_asgi_application


DEBUG_MODE = config('DEBUG', default=False, cast=bool)

if DEBUG_MODE:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.envs.development')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.envs.production')

django_application = get_asgi_application()

async def application(scope, receive, send):
    if scope['type'] == 'lifespan':
        while True:
            message = await receive()
            if message['type'] == 'lifespan.startup':
                await send({'type': 'lifespan.startup.complete'})
            elif message['type'] == 'lifespan.shutdown':
                await send({'type': 'lifespan.shutdown.complete'})
                return
    else:
        await django_application(scope, receive, send)