from rest_framework import routers

from . import views


app_name = "v1_auth"

router = routers.SimpleRouter()

router.register("create_user", views.UserCreateViewSet, basename="create_user")

urlpatterns = [

] + router.urls