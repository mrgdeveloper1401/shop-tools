from enum import Enum
from django.db import models
from django.utils.translation import gettext_lazy as _


class FileTypeChoices(Enum):
    PRODUCT_PHOTO = 'product.photo'
    PRODUCT_VIDEO = 'product.video'
    USER_AVATAR = 'user.avatar'
    USER_COVER = 'user.cover'
    VENDOR_COVER = 'vendor.cover'
    VENDOR_LOGO = 'vendor.logo'
    CHAT_PHOTO = 'chat.photo'
    CHAT_VIDEO = 'chat.video'
    CHAT_VOICE = 'chat.voice'
    CHAT_FILE = 'chat.file'


class ImageTypeChoices(Enum):
    PRODUCT_PHOTO = 'product.photo'


class ProductCreateStatus(models.TextChoices):
    published = "published", _("2976")
    draft = "draft", _("3790")
    illegal = "illegal", _("4184")
    waiting = "waiting", _("3568")
