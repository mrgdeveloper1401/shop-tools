from rest_framework_nested import routers
from django.urls import path, include
from rest_framework_nested.routers import NestedSimpleRouter

from . import views

app_name = "v1_product_app"

router = routers.SimpleRouter()
router.register("product_category", views.ProductCategoryViewSet, basename="product_category")
router.register("product_brand", views.ProductBrandViewSet, basename="product_brand")
router.register("product_attribute", views.ProductAttributeViewSet, basename="product_attribute")
router.register("product_attribute_value", views.ProductAttributeValueViewSet, basename="product_attribute_value")
router.register("product_tag", views.TagViewSet, basename="product_tag")

category_router = routers.NestedSimpleRouter(router, "product_category", lookup="category")
category_router.register("products", views.ProductViewSet, basename="products")

product_router = routers.NestedSimpleRouter(category_router, "products", lookup="product")
product_router.register("product_variant", views.ProductVariantViewSet, basename="product_variant")
product_router.register("product_images", views.ProductImageViewSet, basename="product_images")

product_variant_router = NestedSimpleRouter(product_router, "product_variant", lookup="variant")
product_variant_router.register(
    "variant_attribute",
    views.VariantAttributeViewSet,
    basename="variant_attribute"
)

urlpatterns = [
    path("", include(category_router.urls)),
    path("", include(product_router.urls)),
    path("", include(product_variant_router.urls)),
    path("product_home_page/", views.ProductListHomePageView.as_view(), name='product_home_page'),
    # path("create_product/", views.CreateAdminProductView.as_view(), name='admin_create_product'),
    # path("create_product_image/", views.AdminCreateProductImage.as_view(), name='admin_create_product_image'),
    # path(
    #     'create_variant_attribute/',
    #     views.AdminCreateVariantAttributeView.as_view(),
    #     name='admin_create_variant_attribute'
    # )
] + router.urls
