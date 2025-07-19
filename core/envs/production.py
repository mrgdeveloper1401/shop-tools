from core.settings import *

ALLOWED_HOSTS = config("PRODUCTION_ALLOWED_HOSTS", cast=Csv())

INSTALLED_APPS += [
    "corsheaders",
]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": config("DB_NAME", cast=str),
        "USER": config("DB_USER", cast=str),
        "PASSWORD": config("DB_PASSWORD", cast=str),
        "HOST": config("DB_HOST", cast=str),
        "PORT": config("DB_PORT", cast=int),
    }
}

MIDDLEWARE += [
    "corsheaders.middleware.CorsMiddleware",
]

CORS_ALLOWED_ORIGINS = config("PRODUCTION_CORS_ALLOWED_ORIGINS", cast=Csv())

STATIC_ROOT = BASE_DIR / "staticfiles"

CACHES['default']['LOCATION'] = config("PRODUCTION_LOCATION_CACHE", cast=str)

CELERY_BROKER_URL=config("PRODUCTION_CELERY_BROKER_URL", cast=str)
CELERY_RESULT_BACKEND=config("PRODUCTION_CELERY_RESULT_BACKEND", cast=str)
