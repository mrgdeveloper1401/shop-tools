from django.contrib import admin
from treebeard.admin import TreeAdmin
from treebeard.forms import movenodeform_factory

from .models import (
    CategoryBlog,
    PostBlog,
    CommentBlog,
    Like,
    TagBlog
)


@admin.register(CategoryBlog)
class CategoryBlogAdmin(TreeAdmin):
    form = movenodeform_factory(CategoryBlog)
    list_display = ("id", "category_name", "is_active", "category_slug", "created_at")
    search_fields = ("category_name",)
    search_help_text = "برای جست و جو میتوانید از نام دسته بندی استفاده کنید"
    list_filter = ("is_active",)
    list_editable = ("is_active",)
    list_display_links = ("id", "category_name")
    list_per_page = 20


@admin.register(PostBlog)
class PostBlogAdmin(admin.ModelAdmin):
    list_display = ("id", "post_title", "read_time", "category_id", "is_active", "created_at", "updated_at")
    list_per_page = 20
    list_display_links = ("id", "post_title")
    list_editable = ("is_active",)
    raw_id_fields = ("author", "category", "tags", "post_cover_image")


@admin.register(CommentBlog)
class CommentBlogAdmin(admin.ModelAdmin):
    pass


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    pass


@admin.register(TagBlog)
class TagBlogAdmin(admin.ModelAdmin):
    list_display = ("id", "tag_name", "is_active", "created_at", "updated_at")
    list_per_page = 20
    search_fields = ("tag_name",)
    list_filter = ("is_active", "created_at", "updated_at")
    list_editable = ("is_active", )
    search_help_text = "برای جست و جو میتوانید از تگ استفاده کنید"
    list_display_links = ("id", "tag_name")