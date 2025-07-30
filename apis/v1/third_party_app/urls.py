from rest_framework.urls import path
from rest_framework import routers

from . import views

app_name = 'v1_third_party_app'

router = routers.SimpleRouter()
router.register(r'create_list_image', views.CreateListImage, basename='create_liat_image')

urlpatterns = [
    path("user_info_ba_salam/", views.GetUserInformation.as_view(), name="user_info_ba_salam"),
    path("crete_product_ba_salam/", views.CreateProductView.as_view(), name="create_product_ba_salam"),
    path("product_list_ba_salam/", views.ListProductView.as_view(), name="product_list_ba_salam"),
] + router.urls
