from rest_framework import routers

from . import views

app_name = 'v1_core'

router = routers.SimpleRouter()

router.register('public_notifications', views.PublicNotificationViewSet, basename='public_notifications')
router.register("admin_images", views.AdminImageViewSet, basename='admin_images')

urlpatterns = router.urls