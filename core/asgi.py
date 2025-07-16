"""
ASGI config for core project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os
from decouple import config

from django.core.asgi import get_asgi_application

DEBUG_MODE = config('DEBUG', default=False, cast=bool)

if DEBUG_MODE:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.envs.development')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.envs.production')

application = get_asgi_application()
