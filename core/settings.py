from datetime import timedelta
from pathlib import Path
import os
from decouple import config, Csv
from kombu import Queue
from django.utils import timezone
from .utils.ck_editor import CKEDITOR_5_CONFIGS

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

DEBUG = config('DEBUG', default=True, cast=bool)

ALLOWED_HOSTS = config("ALLOWED_HOSTS", cast=Csv(), default='*')

SECRET_KEY = config("SECRET_KEY", cast=str, default="hello_world_django_gs_tools")

INSTALLED_APPS = [
    # built in django
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # third party  package
    "rest_framework",
    "django_ckeditor_5",
    "drf_spectacular",
    "drf_spectacular_sidecar",
    "rest_framework_simplejwt",
    "django_filters",
    "django_extensions",
    "treebeard",
    "django_json_widget",
    "daterangefilter",
    "rest_framework_simplejwt.token_blacklist",
    "django_celery_beat",
    "import_export",

    # third party app
    "account_app.apps.AccountAppConfig",
    "product_app.apps.ProductAppConfig",
    "blog_app.apps.BlogAppConfig",
    "core_app.apps.CoreAppConfig",
    "order_app.apps.OrderAppConfig",
    "discount_app.apps.DiscountAppConfig",
    "third_api_app.apps.ThirdApiAppConfig"
]


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": config("DB_NAME", cast=str, default="gs_tools"),
        "USER": config("DB_USER", cast=str, default="postgres"),
        "PASSWORD": config("DB_PASSWORD", cast=str, default="postgres"),
        "HOST": config("DB_HOST", cast=str, default="localhost"),
        "PORT": config("DB_PORT", cast=int, default=5433),
        # "CONN_MAX_AGE": config("CON_MAX_AGE", cast=int, default=60),
        'OPTIONS': {
            'pool': {
                # for tow core --> (4, 20) connection
                # for tow core and 5 worker --> 5 * 20 = 100 connection
                'min_size': config("POOL_MIN_SIZE", cast=int, default=4),       # Minimum number of connections in the pool
                'max_size': config("POOL_MAX_SIZE", cast=int, default=15),       # Maximum number of connections in the pool
                'timeout': config("POOL_TIMEOUT", cast=int, default=30),  # Connection lifetime in seconds (optional)
            }
        }
    }
}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


WSGI_APPLICATION = 'core.wsgi.application'

# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/
LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Tehran'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / "staticfiles"

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'account_app.User'

# swagger settings
SPECTACULAR_SETTINGS = {
    'TITLE': 'production shop tools',
    'DESCRIPTION': 'production API description shop tools',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'SWAGGER_UI_DIST': 'SIDECAR',
    'SWAGGER_UI_FAVICON_HREF': 'SIDECAR',
}

# Define a constant in settings.py to specify file upload permissions
CKEDITOR_5_FILE_UPLOAD_PERMISSION = "staff"  # Possible values: "staff", "authenticated", "any"

# drf framework settings
REST_FRAMEWORK = {
    # YOUR SETTINGS
    'DEFAULT_VERSIONING_CLASS': 'rest_framework.versioning.URLPathVersioning',
    'DEFAULT_VERSION': 'v1',
    'ALLOWED_VERSIONS': ['v1'],
    "EXCEPTION_HANDLER": "rest_framework.views.exception_handler",
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
    ),
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/minute',  # 100 درخواست در دقیقه برای کاربران ناشناس
        'user': '200/minute',  # 200 درخواست در دقیقه برای کاربران عادی
    }
}

# config JWT settings
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
    "ALGORITHM": "HS256",
    "VERIFYING_KEY": "",
    "AUDIENCE": config("AUDIENCE", cast=str, default=None),
    "ISSUER": None,
    "JSON_ENCODER": None,
    "JWK_URL": None,
    "LEEWAY": 0,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "JTI_CLAIM": "jti",
}
if DEBUG:
    SIMPLE_JWT['SIGNING_KEY'] = "salam_donna"
else:
    SIMPLE_JWT['SIGNING_KEY'] = config("JWT_SIGNING_KEY", cast=str, default=SECRET_KEY)

# config cache
CACHES = {
    "default": {
         "BACKEND": "django_redis.cache.RedisCache",
         "LOCATION": config("REDIS_SECOND_URL", default="redis://127.0.0.1:6381/5", cast=str), # inr prod use db 4
         "TIMEOUT": config("REDIS_SECOND_TIMEOUT", default=86400, cast=int),
         "OPTIONS": {
             "CLIENT_CLASS": "django_redis.client.DefaultClient",
             "SOCKET_CONNECT_TIMEOUT": config("SOCKET_SECOND_CONNECT_TIMEOUT", default=5, cast=int),
             "SOCKET_TIMEOUT": config("SOCKET_SECOND_TIMEOUT", default=10, cast=int),
             "SERIALIZER": config("CACHE_SECOND_SERIALIZER", default="django_redis.serializers.msgpack.MSGPackSerializer"),
             # "COMPRESSOR": config("REDIS_SECOND_COMPRESSOR", default="django_redis.compressors.zlib.ZlibCompressor"),
             # "COMPRESSOR_KWARGS": {
             #     "level": config("COMPRESSOR_SECOND_LEVEL_ARGS", default=6, cast=int)
             # },
             "CONNECTION_POOL_KWARGS": {
                 # fot tow core --> 20 connection --> 2 * 2 * 5 = 20
                 "max_connections": config("REDIS_SECOND_POOL_MAX_CONNECTION", default=25, cast=int),
                 "retry_on_timeout": config("REDIS_SECOND_POOL_RETRY_TIMEOUT", default=True, cast=bool),
                 "health_check_interval": config("REDIS_SECOND_HEALTH_CHECK_INTERVAL", default=True, cast=bool),
                 "socket_keepalive": config("REDIS_SECOND_SOCKET_KEEPALIVE", default=True, cast=bool),
             }
        }
    },
}
SESSION_ENGINE = config("SESSION_ENGINE", default="django.contrib.sessions.backends.cache", cast=str)
SESSION_CACHE_ALIAS = config("SESSION_CACHE_ALIAS", default="default", cast=str)
DJANGO_REDIS_IGNORE_EXCEPTIONS = config("DJANGO_REDIS_IGNORE_EXCEPTIONS", default=True, cast=bool)
DJANGO_REDIS_LOG_IGNORED_EXCEPTIONS = config("DJANGO_REDIS_LOG_IGNORED_EXCEPTIONS", default=True, cast=bool)

# config celery
CELERY_BROKER_URL = config("PRODUCTION_CELERY_BROKER_URL", cast=str, default='redis://localhost:6381/6') # inr prod use db 2
CELERY_RESULT_BACKEND = config("PRODUCTION_CELERY_RESULT_BACKEND", cast=str, default='redis://localhost:6381/7') # inr prod use db 3
CELERY_ACCEPT_CONTENT = config("CELERY_ACCEPT_CONTENT", default="json", cast=Csv())
CELERY_TASK_SERIALIZER = config("CELERY_TASK_SERIALIZER", cast=str, default='json')
CELERY_RESULT_SERIALIZER = config("CELERY_RESULT_SERIALIZER", cast=str, default='json')
CELERY_TIMEZONE=config("CELERY_TIMEZONE", cast=str, default=TIME_ZONE)
CELERY_ENABLE_UTC=config("CELERY_ENABLE_UTC", cast=bool, default=True)
CELERY_WORKER_CONCURRENCY = os.cpu_count()
CELERY_TASK_ALWAYS_EAGER = False
CELERY_TASK_ACKS_LATE = True
CELERY_WORKER_MAX_TASKS_PER_CHILD = config("WORKER_MAX_TASKS_PER_CHILD", cast=int, default=1000)  # بعد از چند تسک، Worker child ری‌استارت شود تا از memory leak جلوگیری شود
CELERY_WORKER_MAX_MEMORY_PER_CHILD = config("WORKER_MAX_MEMORY_PER_CHILD", cast=int, default=200000)  # اگر مصرف حافظه Worker child از این مقدار (کیلوبایت) بیشتر شد، ری‌استارت شود

# celery beat config
CELERY_BEAT_SCHEDULER = "django_celery_beat.schedulers:DatabaseScheduler"

# cors origin
USE_CORS = config("USE_CORS", cast=bool, default=False)
if USE_CORS:
    MIDDLEWARE.insert(0, "corsheaders.middleware.CorsMiddleware")
    CORS_ALLOWED_ORIGINS = config("PRODUCTION_CORS_ALLOWED_ORIGINS", cast=Csv())
    CORS_ALLOW_CREDENTIALS = config("CORS_ALLOW_CREDENTIALS", cast=bool, default=True)
    INSTALLED_APPS.append("corsheaders")

USE_SSL = config("USE_SSL", cast=bool, default=False)
if USE_SSL:
    SESSION_COOKIE_SECURE = config("SESSION_COOKIE_SECURE", cast=bool, default=True)
    CSRF_COOKIE_SECURE = config("CSRF_COOKIE_SECURE", cast=bool, default=True)
    CSRF_COOKIE_HTTPONLY = config("CSRF_COOKIE_HTTPONLY", cast=bool, default=True)
    CSRF_COOKIE_SAMESITE = config("CSRF_COOKIE_SAMESITE", cast=str, default='Strict')
    CSRF_USE_SESSIONS = config("CSRF_USE_SESSIONS", cast=bool, default=True)
    SECURE_SSL_REDIRECT = config("SECURE_SSL_REDIRECT", cast=bool, default=True)
    SECURE_HSTS_SECONDS = config("SECURE_HSTS_SECONDS", cast=int, default=31536000)
    SECURE_HSTS_PRELOAD = config("SECURE_HSTS_PRELOAD", cast=bool, default=True)
    SECURE_HSTS_INCLUDE_SUBDOMAINS = config("SECURE_HSTS_INCLUDE_SUBDOMAINS", cast=bool, default=True)
    SECURE_CONTENT_TYPE_NOSNIFF = config("SECURE_CONTENT_TYPE_NOSNIFF", cast=bool, default=True)
    SECURE_BROWSER_XSS_FILTER = config("SECURE_BROWSER_XSS_FILTER", cast=bool, default=True)
    X_FRAME_OPTIONS = config("X_FRAME_OPTIONS", cast=str, default='DENY')
    SECURE_REFERRER_POLICY = config("SECURE_REFERRER_POLICY", cast=str, default='strict-origin')
    USE_X_FORWARDED_HOST = config("USE_X_FORWARDED_HOST", cast=bool, default=True)
    USE_X_FORWARDED_PORT = config("USE_X_FORWARDED_PORT", cast=bool, default=True)
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", config("HTTP_X_FORWARDED_PROTO", cast=str, default='https'))
    CSRF_COOKIE_AGE = config("CSRF_COOKIE_AGE", cast=int, default=3600)
    SESSION_COOKIE_DOMAIN = config("SESSION_COOKIE_DOMAIN", cast=str, default='api.gs-tools.ir')
    CSRF_COOKIE_DOMAIN = config("CSRF_COOKIE_DOMAIN", cast=str, default='api.gs-tools.ir')

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
log_dir = os.path.join('general_log_django', timezone.now().strftime("%Y-%m-%d"))
os.makedirs(log_dir, exist_ok=True)
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "error_file": {
            "level": "ERROR",
            "class": "logging.FileHandler",
            "filename": os.path.join(log_dir, 'error_file.log')
        },
        "warning_file": {
            "level": "WARN",
            "class": "logging.FileHandler",
            "filename": os.path.join(log_dir, 'warning_file.log')
        },
        "critical_file": {
            "level": "CRITICAL",
            "class": "logging.FileHandler",
            "filename": os.path.join(log_dir, 'critical_file.log')
        },
    },
    "loggers": {
        "django": {
            "handlers": ["warning_file", "critical_file", "error_file"],
            'propagate': True,
        }
    }
}

# config storage
STORAGES = {
    'default':
        {
            'BACKEND': 'storages.backends.s3.S3Storage'
        },
    'staticfiles':
        {
            'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage'
        }
}

# ckeditor
CKEDITOR_5_FILE_STORAGE = STORAGES['default']['BACKEND']

# celery queue
CELERY_TASK_QUEUES = (
    Queue("notifications"),
    Queue("otp_sms"),
    Queue("ba_salam"),
    Queue("payment"),
    Queue("update_order"),
)

USE_DEBUG_TOOLBAR = config("USE_DEBUG_TOOLBAR", cast=bool, default=True)
if USE_DEBUG_TOOLBAR and DEBUG:
    INSTALLED_APPS.append('debug_toolbar')
    MIDDLEWARE.append("debug_toolbar.middleware.DebugToolbarMiddleware",)
    INTERNAL_IPS = ["127.0.0.1"]

# django silk
USE_DJANGO_SILK = config("USE_DJANGO_SILK", cast=bool, default=False)