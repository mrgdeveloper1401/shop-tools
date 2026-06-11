from rest_framework.urls import path
from .views import ProductListHomePageView

app_name = "v2_product"

urlpatterns = [
    path("product_list", ProductListHomePageView.as_view(), name="product_home_page"),
]
