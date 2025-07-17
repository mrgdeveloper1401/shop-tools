from django.db import models
from django_ckeditor_5.fields import CKEditor5Field
from treebeard.mp_tree import MP_Node

from core_app.models import CreateMixin, UpdateMixin, SoftDeleteMixin


class CategoryBlog(MP_Node, CreateMixin, UpdateMixin):
    category_name = models.CharField(max_length=255, db_index=True)
    category_slug = models.SlugField(max_length=500, allow_unicode=True)
    is_active = models.BooleanField(default=True)
    description_slug = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "blog_category"


class TagBlog(CreateMixin, UpdateMixin, SoftDeleteMixin):
    tag_name = models.CharField(max_length=255, db_index=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "blog_tag"


class PostBlog(CreateMixin, UpdateMixin, SoftDeleteMixin):
    author = models.ManyToManyField('account_app.User', related_name='post_authors')
    category = models.ForeignKey(CategoryBlog, on_delete=models.PROTECT, related_name="blog_posts")
    post_title = models.CharField(max_length=255)
    post_slug = models.SlugField(max_length=500, allow_unicode=True)
    post_body = CKEditor5Field(config_name='extends')
    read_time = models.PositiveSmallIntegerField()
    post_cover_image = models.ForeignKey(
        "core_app.Image",
        on_delete=models.PROTECT,
        related_name="blog_posts_cover_image",
    )
    tags = models.ManyToManyField("TagBlog", blank=True, related_name="post_tags")
    likes = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    description_slug = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "blog_post"


class CommentBlog(MP_Node, CreateMixin, UpdateMixin):
    user = models.ForeignKey(
        "account_app.User",
        on_delete=models.DO_NOTHING,
        related_name="comment_user_posts"
    )
    post = models.ForeignKey(
        PostBlog,
        on_delete=models.DO_NOTHING,
        related_name="comment_posts"
    )
    comment_body = models.TextField()
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'blog_comment'
        ordering = ('-id',)


class Like(CreateMixin):
    user = models.ForeignKey(
        "account_app.User",
        on_delete=models.DO_NOTHING,
        related_name="user_likes"
    )
    post = models.ForeignKey(
        "PostBlog",
        on_delete=models.DO_NOTHING,
        related_name="post_likes"
    )

    class Meta:
        unique_together = ('user', 'post')
        db_table = "blog_post_like"
