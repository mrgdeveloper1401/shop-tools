from django.db import models
from django.utils import timezone
from django.utils.functional import cached_property
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
        help_text=_('Upload the original image file.'),
        null=True,
    )
    image_id_ba_salam = models.BigIntegerField(
        blank=True,
        null=True,
        editable=False,
        help_text=_('ID of the image in external storage')
    )
    wp_image_url = models.CharField(max_length=500, null=True, blank=True)

    @cached_property
    def get_image_url(self):
        return self.image.url if self.image else self.wp_image_url

    class Meta:
        ordering = ("-id",)
        db_table = 'core_app_image'


class UploadFile(CreateMixin, UpdateMixin, SoftDeleteMixin):
    file = models.FileField(upload_to='upload_file/%Y/%m/%d/')
    file_id_ba_salam = models.BigIntegerField(
        editable=False,
        blank=True,
        null=True,
    )

    class Meta:
        db_table = "upload_file"
        ordering = ("-id",)


class PublicNotification(CreateMixin, UpdateMixin, SoftDeleteMixin):
    title = models.CharField(max_length=255)
    body = models.TextField()
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "public_notification"


class MainSite(CreateMixin, UpdateMixin, SoftDeleteMixin):
    # header_title = ArrayField(models.CharField(max_length=50))
    header_title = models.CharField(max_length=255)
    images = models.ManyToManyField(Image, related_name="main_site_images", blank=True)
    text_color = models.CharField(max_length=50)
    background_color = models.CharField(max_length=50)
    is_publish = models.BooleanField(default=True)

    class Meta:
        db_table = "main_site"
        ordering = ("-id",)


class Carousel(CreateMixin, UpdateMixin, SoftDeleteMixin):
    image = models.ForeignKey(
        "core_app.Image",
        on_delete=models.PROTECT,
        related_name="carousel_images",
        blank=True,
        null=True,
    )
    name = models.CharField(max_length=255)

    class Meta:
        db_table = "carousel"
        ordering = ("-id",)


class SitemapEntry(CreateMixin, SoftDeleteMixin):
    slug_text = models.TextField()
    last_modified = models.CharField(blank=True)
    changefreq = models.CharField(
        max_length=255,
    )
    priority = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0.5,
        help_text='A value between 0.00 and 1.00'
    )

    class Meta:
        db_table = "site_map"
