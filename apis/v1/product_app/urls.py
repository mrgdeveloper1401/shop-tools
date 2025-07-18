from rest_framework_nested import routers
from django.urls import path, include

from . import views

app_name = "v1_product_app"

router = routers.SimpleRouter()
router.register("product_category", views.ProductCategoryViewSet, basename="product_category")
router.register("product_brand", views.ProductBrandViewSet, basename="product_brand")
router.register("product_images", views.ProductImageViewSet, basename="product_images")

category_router = routers.NestedSimpleRouter(router, "product_category", lookup="category")
category_router.register("products", views.ProductViewSet, basename="products")

urlpatterns = [
    path("", include(category_router.urls)),
] + router.urls
