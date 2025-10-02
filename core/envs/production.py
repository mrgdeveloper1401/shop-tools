import datetime
import os

from core.settings import *


ALLOWED_HOSTS = config("PRODUCTION_ALLOWED_HOSTS", cast=Csv())

SECRET_KEY = config("PRODUCTION_SECRET_KEY", cast=str)

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
        "CONN_MAX_AGE": config("CON_MAX_AGE", cast=int, default=600)
    }
}

MIDDLEWARE += [
    "corsheaders.middleware.CorsMiddleware",
]

CORS_ALLOWED_ORIGINS = config("PRODUCTION_CORS_ALLOWED_ORIGINS", cast=Csv())

CACHES['default']['LOCATION'] = config("PRODUCTION_LOCATION_CACHE", cast=str)

CELERY_BROKER_URL=config("PRODUCTION_CELERY_BROKER_URL", cast=str)
CELERY_RESULT_BACKEND=config("PRODUCTION_CELERY_RESULT_BACKEND", cast=str)

# SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'Strict'
CSRF_USE_SESSIONS = True
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_PRELOAD = True
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = "DENY"
SECURE_REFERRER_POLICY = "strict-origin"
USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
CSRF_COOKIE_AGE = 3600

AWS_S3_REGION_NAME = 'eu-west-1'
AWS_DEFAULT_ACL = 'public-read'
AWS_QUERYSTRING_AUTH = False
AWS_ACCESS_KEY_ID = config('ARVAN_AWS_ACCESS_KEY_ID', cast=str)
AWS_SECRET_ACCESS_KEY = config('ARVAN_AWS_SECRET_ACCESS_KEY', cast=str)
AWS_STORAGE_BUCKET_NAME = config('ARVAN_AWS_STORAGE_BUCKET_NAME', cast=str)
AWS_S3_ENDPOINT_URL = config('ARVAN_AWS_S3_ENDPOINT_URL', cast=str)
AWS_S3_FILE_OVERWRITE = False
AWS_S3_MAX_MEMORY_SIZE = 1024 * 1024 * 2

# with logging django
log_dir = os.path.join(BASE_DIR / 'general_log_django', datetime.date.today().strftime("%Y-%m-%d"))
os.makedirs(log_dir, exist_ok=True)
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "color": {
            "()": "colorlog.ColoredFormatter",
            "format": "%(log_color)s%(levelname)s %(reset)s%(asctime)s %(module)s %(process)d %(thread)d %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
    },
    "handlers": {
        "error_file": {
            "level": "ERROR",
            "class": "logging.FileHandler",
            "formatter": "color",
            "filename": os.path.join(BASE_DIR / log_dir / 'error_file.log')
        },
        "warning_file": {
            "level": "WARN",
            "class": "logging.FileHandler",
            "formatter": "color",
            "filename": os.path.join(BASE_DIR / log_dir / 'warning_file.log')
        },
        "critical_file": {
            "level": "CRITICAL",
            "class": "logging.FileHandler",
            "formatter": "color",
            "filename": os.path.join(BASE_DIR / log_dir / 'critical_file.log')
        },
    },
    "loggers": {
        "django": {
            "handlers": ["warning_file", "critical_file", "error_file"],
            'propagate': True,
        }
    }
}

# FILE_UPLOAD_MAX_MEMORY_SIZE = 1024 * 1024 * 2
# DATA_UPLOAD_MAX_MEMORY_SIZE = 1024 * 1024 * 2

# config storage
STORAGES = {
    'default':
        {
            'BACKEND': 'storages.backends.s3.S3Storage'
        },
    'staticfiles':
        {
            'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage'
        }
}

CKEDITOR_5_FILE_STORAGE = STORAGES['default']['BACKEND']