from rest_framework import routers

from . import views

app_name = "v1_blog"

router = routers.SimpleRouter()

router.register("category_blog", views.CategoryBlogViewSet, basename="category_blog")

urlpatterns = router.urls
