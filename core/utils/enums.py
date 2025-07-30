from enum import Enum


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
