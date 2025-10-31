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
