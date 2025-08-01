from rest_framework.urls import path
from rest_framework import routers

from . import views

app_name = 'v1_third_party_app'

router = routers.SimpleRouter()
router.register(r'create_list_image', views.CreateListImage, basename='create_liat_image')
router.register("create_list_upload_file", views.CreateListUploadFileViewSet, basename='create_list_upload_file')

urlpatterns = [
    path("user_info_ba_salam/", views.GetUserInformation.as_view(), name="user_info_ba_salam"),
    path("crete_product_ba_salam/", views.CreateProductView.as_view(), name="create_product_ba_salam"),
    path("product_list_ba_salam/", views.ListProductView.as_view(), name="product_list_ba_salam"),
    path("read_categories/", views.ReadCategoryView.as_view(), name="read_categories"),
    path("read_categories/<int:category_id>/", views.ReadCategoryView.as_view(), name="read_categories"),
] + router.urls
