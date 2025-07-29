from rest_framework.urls import path

from . import views

app_name = 'v1_third_party_app'

urlpatterns = [
    path("user_info_ba_salam/", views.GetUserInformation.as_view(), name="user_info_ba_salam"),
    path("create_image_ba_salam/", views.CreateImage.as_view(), name="create_image_ba_salam"),
]
