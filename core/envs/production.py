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

# SESSION_COOKIE_SECURE = True
# CSRF_COOKIE_SECURE = True
# CSRF_COOKIE_HTTPONLY = True
# CSRF_COOKIE_SAMESITE = 'Strict'
# CSRF_USE_SESSIONS = True
# SECURE_SSL_REDIRECT = True
# SECURE_HSTS_SECONDS = 31536000
# SECURE_HSTS_PRELOAD = True
# SECURE_HSTS_INCLUDE_SUBDOMAINS = True
# SECURE_CONTENT_TYPE_NOSNIFF = True
# SECURE_BROWSER_XSS_FILTER = True
# X_FRAME_OPTIONS = "DENY"
# SECURE_REFERRER_POLICY = "strict-origin"
# USE_X_FORWARDED_HOST = True
# SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
# CSRF_COOKIE_AGE = 3600

STORAGES = {
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
    "default": {
        "BACKEND": "storages.backends.s3.S3Storage",
    },
}

AWS_S3_REGION_NAME = 'us-east-1'
AWS_DEFAULT_ACL = 'public-read'
AWS_QUERYSTRING_AUTH = False
AWS_ACCESS_KEY_ID = config('ARVAN_AWS_ACCESS_KEY_ID', cast=str)
AWS_SECRET_ACCESS_KEY = config('ARVAN_AWS_SECRET_ACCESS_KEY', cast=str)
AWS_STORAGE_BUCKET_NAME = config('ARVAN_AWS_STORAGE_BUCKET_NAME', cast=str)
AWS_S3_ENDPOINT_URL = config('ARVAN_AWS_S3_ENDPOINT_URL', cast=str)
