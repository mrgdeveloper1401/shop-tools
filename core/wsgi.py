"""
WSGI config for core project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os

from decouple import config
from django.core.wsgi import get_wsgi_application

DEBUG_MODE = config('DEBUG', default=False, cast=bool)

if DEBUG_MODE:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.envs.development')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.envs.production')
application = get_wsgi_application()
