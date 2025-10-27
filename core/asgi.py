import os
from decouple import config
from django.core.asgi import get_asgi_application

# import ipdb
# ipdb.set_trace()
DEBUG_MODE = config('DEBUG', default=False, cast=bool)

if DEBUG_MODE:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.envs.development')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.envs.production')

django_application = get_asgi_application()

async def application(scope, receive, send):
    # import ipdb
    # ipdb.set_trace()
    if scope['type'] == 'lifespan':
        while True:
            message = await receive()
            if message['type'] == 'lifespan.startup':
                # print("✅ Django ASGI startup event received")
                await send({'type': 'lifespan.startup.complete'})
            elif message['type'] == 'lifespan.shutdown':
                # print("❌ Django ASGI shutdown event received")
                await send({'type': 'lifespan.shutdown.complete'})
                return
    else:
        await django_application(scope, receive, send)