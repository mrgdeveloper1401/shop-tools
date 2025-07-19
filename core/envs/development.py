from core.settings import *

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-bpg-62bxjk+m1fotiez1b#oi295y!r!)k!*&er0lj3b1h_cw_e'

# SECURITY WARNING: don't run with debug turned on in production!
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


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

MEDIA_ROOT = BASE_DIR / 'media'
MEDIA_URL = '/media/'

CKEDITOR_5_FILE_STORAGE = "django.core.files.storage.FileSystemStorage"

SIMPLE_JWT["SIGNING_KEY"] = SECRET_KEY

CORS_ALLOW_ALL_ORIGINS = True

CACHES['default']['LOCATION'] = "redis://127.0.0.1:6380/1"
