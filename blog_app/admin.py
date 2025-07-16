from django.contrib import admin

from .models import (
    CategoryBlog,
    PostBlog,
    CommentBlog,
    Like,
    TagBlog
)


@admin.register(CategoryBlog)
class CategoryBlogAdmin(admin.ModelAdmin):
    pass


@admin.register(PostBlog)
class PostBlogAdmin(admin.ModelAdmin):
    pass


@admin.register(CommentBlog)
class CommentBlogAdmin(admin.ModelAdmin):
    pass


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    pass


@admin.register(TagBlog)
class TagBlogAdmin(admin.ModelAdmin):
    pass
