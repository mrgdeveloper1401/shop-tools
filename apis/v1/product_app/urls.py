from rest_framework import routers

from apis.v1.product_app.views import ProductCategoryViewSet

app_name = "v1_product_app"

router = routers.SimpleRouter()
router.register("product_category", ProductCategoryViewSet, basename="product_category")

urlpatterns = router.urls
