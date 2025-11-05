from datetime import timedelta
from pathlib import Path
import os
from decouple import config, Csv
from kombu import Queue
from django.utils import timezone


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

DEBUG = False

ALLOWED_HOSTS = config("PRODUCTION_ALLOWED_HOSTS", cast=Csv())

SECRET_KEY = config("PRODUCTION_SECRET_KEY", cast=str)

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
    "adrf",
    "corsheaders",

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
        "NAME": config("DB_NAME", cast=str),
        "USER": config("DB_USER", cast=str),
        "PASSWORD": config("DB_PASSWORD", cast=str),
        "HOST": config("DB_HOST", cast=str),
        "PORT": config("DB_PORT", cast=int),
        "CONN_MAX_AGE": config("CON_MAX_AGE", cast=int, default=300),
        # 'OPTIONS': {
        #     'pool': {
        #         'min_size': os.cpu_count() * 2,       # Minimum number of connections in the pool
        #         'max_size': os.cpu_count() * 4,       # Maximum number of connections in the pool
        #         # 'increment': 1,  # Number of new connections to create when needed
        #         'timeout': config("POOL_TIMEOUT", cast=int, default=30),  # Connection lifetime in seconds (optional)
        #     }
        # }
    }
}

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    "whitenoise.middleware.WhiteNoiseMiddleware",
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

# WSGI_APPLICATION = 'core.wsgi.application'
ASGI_APPLICATION = 'core.asgi.application'

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
    # "ROTATE_REFRESH_TOKENS": True,
    # "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": True,

    "ALGORITHM": "HS256",
    "VERIFYING_KEY": "",
    "SIGNING_KEY": config("JWT_SIGNING_KEY", cast=str),
    "AUDIENCE": None,
    "ISSUER": None,
    "JSON_ENCODER": None,
    "JWK_URL": None,
    "LEEWAY": 0,

    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "USER_AUTHENTICATION_RULE": "rest_framework_simplejwt.authentication.default_user_authentication_rule",

    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",

    "JTI_CLAIM": "jti",

    # "SLIDING_TOKEN_REFRESH_EXP_CLAIM": "refresh_exp",
    # "SLIDING_TOKEN_LIFETIME": timedelta(minutes=5),
    # "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=1),

    "TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainPairSerializer",
    "TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSerializer",
    "TOKEN_VERIFY_SERIALIZER": "rest_framework_simplejwt.serializers.TokenVerifySerializer",
    "TOKEN_BLACKLIST_SERIALIZER": "rest_framework_simplejwt.serializers.TokenBlacklistSerializer",
    # "SLIDING_TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainSlidingSerializer",
    # "SLIDING_TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSlidingSerializer",
}

# config cache
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": config("PRODUCTION_LOCATION_CACHE", cast=str),
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    }
}

SESSION_ENGINE = "django.contrib.sessions.backends.cache"

# config celery
CELERY_BROKER_URL=config("PRODUCTION_CELERY_BROKER_URL", cast=str)
CELERY_RESULT_BACKEND=config("PRODUCTION_CELERY_RESULT_BACKEND", cast=str)
CELERY_ACCEPT_CONTENT = config("CELERY_ACCEPT_CONTENT", default="json", cast=Csv())
CELERY_TASK_SERIALIZER=config("CELERY_TASK_SERIALIZER", cast=str)
CELERY_RESULT_SERIALIZER=config("CELERY_RESULT_SERIALIZER", cast=str)
CELERY_TIMEZONE=config("CELERY_TIMEZONE", cast=str)
CELERY_ENABLE_UTC=config("CELERY_ENABLE_UTC", cast=bool)
CELERY_WORKER_CONCURRENCY = os.cpu_count()
CELERY_TASK_ALWAYS_EAGER = False
CELERY_TASK_ACKS_LATE = True
CELERY_WORKER_PREFETCH_MULTIPLIER = 1
CELERY_WORKER_MAX_TASKS_PER_CHILD = 100

# celery beat config
CELERY_BEAT_SCHEDULER = "django_celery_beat.schedulers:DatabaseScheduler"


CORS_ALLOWED_ORIGINS = config("PRODUCTION_CORS_ALLOWED_ORIGINS", cast=Csv())

# SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'Strict'
# CSRF_USE_SESSIONS = True
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_PRELOAD = True
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = "DENY"
SECURE_REFERRER_POLICY = "strict-origin"
USE_X_FORWARDED_HOST = True
USE_X_FORWARDED_PORT = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
CSRF_COOKIE_AGE = 3600
SESSION_COOKIE_DOMAIN = ".gs-tools.ir"
CSRF_COOKIE_DOMAIN = ".gs-tools.ir"

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

# celery queue
CELERY_TASK_QUEUES = (
    Queue("notifications"),
    Queue("otp_sms"),
    Queue("ba_salam"),
    Queue("payment"),
    Queue("update_order"),
    Queue("backup_db")
)
