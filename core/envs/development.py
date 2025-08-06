from core.settings import *

SECRET_KEY = 'django-insecure-bpg-62bxjk+m1fotiez1b#oi295y!r!)k!*&er0lj3b1h_cw_e'

DEBUG = True

ALLOWED_HOSTS = []

INSTALLED_APPS += [
    "debug_toolbar"
]

MIDDLEWARE += [
    "debug_toolbar.middleware.DebugToolbarMiddleware",
]

INTERNAL_IPS = [
    # ...
    "127.0.0.1",
    # ...
]

CELERY_BROKER_URL="redis://localhost:6380/2"
CELERY_RESULT_BACKEND="redis://localhost:6380/3"

# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "shop_tools_db2",
        "USER": "postgres",
        "PASSWORD": "postgres",
        "HOST": "localhost",
        "PORT": 5433,
        "CONN_MAX_AGE": 6000
    }
}

# DATABASES = {
#     "default": {
#         "ENGINE": "django.db.backends.mysql",
#         "NAME": "mysql",
#         "USER": "root",
#         "PASSWORD": "password",
#         "HOST": "localhost",
#         "PORT": 3307,
#         "CONN_MAX_AGE": 6000
#     }
# }


MEDIA_ROOT = BASE_DIR / 'media'
MEDIA_URL = '/media/'

CKEDITOR_5_FILE_STORAGE = "django.core.files.storage.FileSystemStorage"

SIMPLE_JWT["SIGNING_KEY"] = SECRET_KEY


CACHES['default']['LOCATION'] = "redis://127.0.0.1:6380/1"

SESSION_ENGINE = "django.contrib.sessions.backends.cache"
