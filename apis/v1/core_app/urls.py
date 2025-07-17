from rest_framework import routers

from apis.v1.core_app.views import PublicNotificationViewSet

app_name = 'v1_core'

router = routers.SimpleRouter()

router.register(r'public_notifications', PublicNotificationViewSet, basename='public_notifications')

urlpatterns = [] + router.urls