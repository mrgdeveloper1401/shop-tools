from rest_framework_nested import routers
from django.urls import path, include

from . import views

app_name = "v1_blog"

router = routers.SimpleRouter()


router.register("category_blog", views.CategoryBlogViewSet, basename="category_blog")
category_router = routers.NestedSimpleRouter(router, "category_blog", lookup="category_blog")
router.register("tag_blog", views.TagBlogViewSet, basename="tag_blog")
router.register("latest_ten_post_blog", views.LatestTenPostBlogViewSet, basename="lates_ten_post_blog")
router.register("seo_post_blog", views.SeoBlogViewSet, basename="seo_blog_api")

category_router.register("post_blog", views.PostBlogViewSet, basename="post_blog")

urlpatterns = [
   path("seo_post_detail_blog/<slug:post_slug>/", views.SeoPostDetailBlogViewSet.as_view(), name='seo_post_detail'),
   path("tag_blog_without_pagination/", views.BlogTagWithOutPaginationView.as_view(), name='tag_blog_without_pagination'),
   path("", include(category_router.urls)),
] + router.urls
