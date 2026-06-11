from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenVerifyView
from rest_framework_simplejwt.views import TokenBlacklistView
from decouple import config


# v1
v1_api_urls = [
    path("v1/auth/", include("apis.v1.account_app.urls", namespace="v1_auth")),
    path("v1/core/", include("apis.v1.core_app.urls", namespace="v1_core")),
    path("v1/blog/", include("apis.v1.blog_app.urls", namespace="v1_blog")),
    path("v1/product/", include("apis.v1.product_app.urls", namespace="v1_product_app")),
    path("v1/order/", include("apis.v1.order_app.urls", namespace="v1_order_app")),
    path("v1/discount/", include("apis.v1.discount_app.urls", namespace="v1_discount_app")),
    path("v1/third_party_app/", include("apis.v1.third_party_app.urls", namespace="v1_third_party_app")),
]

# v2
v2_api_urls = [
    path("v2/product/", include("apis.v2.product.urls", namespace="v2_product")),
]

# swagger
swagger = [
    # YOUR PATTERNS
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Optional UI:
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

# jwt
jwt = [
    path('v1/api/token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path('v1/api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('ckeditor5/', include('django_ckeditor_5.urls')),
] + v1_api_urls + swagger + jwt + v2_api_urls

DEBUG = config("DEBUG", cast=bool)

if DEBUG:
    from debug_toolbar.toolbar import debug_toolbar_urls
    from django.conf.urls.static import static
    from django.conf import settings

    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += debug_toolbar_urls()
