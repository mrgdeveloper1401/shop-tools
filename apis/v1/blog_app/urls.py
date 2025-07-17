from rest_framework import routers

from . import views

app_name = "v1_blog"

router = routers.SimpleRouter()

router.register("category_blog", views.CategoryBlogViewSet, basename="category_blog")
router.register("post_blog", views.PostBlogViewSet, basename="post_blog")
router.register("tag_blog", views.TagBlogViewSet, basename="tag_blog")

urlpatterns = router.urls
