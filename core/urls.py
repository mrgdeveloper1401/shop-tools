"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenVerifyView
from decouple import config

v1_api_urls = [
    path("v1/auth/", include("apis.v1.account_app.urls", namespace="v1_auth")),
    path("v1/core/", include("apis.v1.core_app.urls", namespace="v1_core")),
    path("v1/blog/", include("apis.v1.blog_app.urls", namespace="v1_blog")),
    path("v1/product/", include("apis.v1.product_app.urls", namespace="v1_product_app")),
    path("v1/order/", include("apis.v1.order_app.urls", namespace="v1_order_app")),
    path("v1/discount/", include("apis.v1.discount_app.urls", namespace="v1_discount_app")),
    path("v1/third_party_app/", include("apis.v1.third_party_app.urls", namespace="v1_third_party_app")),
]


swagger = [
    # YOUR PATTERNS
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Optional UI:
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

jwt = [
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('ckeditor5/', include('django_ckeditor_5.urls')),
] + v1_api_urls + swagger + jwt

DEBUG = config("DEBUG", cast=bool)

if DEBUG:
    from debug_toolbar.toolbar import debug_toolbar_urls
    from django.conf.urls.static import static
    from django.conf import settings

    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += debug_toolbar_urls()
