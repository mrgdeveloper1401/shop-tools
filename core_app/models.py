from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from core_app.managers import PublishManager


# Create your models here.

class CreateMixin(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True


class UpdateMixin(models.Model):
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SoftDeleteMixin(models.Model):
    deleted_at = models.DateTimeField(null=True, editable=False)
    is_deleted = models.BooleanField(editable=False, null=True)

    objects = PublishManager()

    def delete(self, using=None, keep_parents=False):
        self.deleted_at = timezone.now()
        self.is_deleted = True
        self.save()

    class Meta:
        abstract = True


class Image(CreateMixin, UpdateMixin, SoftDeleteMixin):
    # File & metadata
    image  = models.ImageField(
        upload_to='images/%Y/%m/%d/',
        help_text=_('Upload the original image file.')
    )
    thumbnail = models.ImageField(
        upload_to='images/thumbnails/%Y/%m/%d/',
        blank=True,
        null=True,
        help_text=_('Optional thumbnail (can be generated on save).')
    )
    title = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text=_('Short descriptive title.')
    )
    alt_text = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text=_('Alt text for accessibility and SEO.')
    )
    caption = models.TextField(
        blank=True,
        help_text=_('Optional longer caption or description.')
    )

    # Optional relations
    # For example: link image to a user or a gallery
    uploaded_by = models.ForeignKey(
        'account_app.User',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='images',
        help_text=_('User who uploaded this image (if any).')
    )

    class Meta:
        ordering = ("-id",)


class PublicNotification(CreateMixin, UpdateMixin, SoftDeleteMixin):
    title = models.CharField(max_length=255)
    body = models.TextField()
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "public_notification"
