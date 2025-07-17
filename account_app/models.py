import random

from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin, UserManager
from django.core.cache import cache
from django.db import models
from django.utils.translation import gettext_lazy as _

from core_app.models import UpdateMixin, SoftDeleteMixin, CreateMixin


# Create your models here.

class User(AbstractBaseUser, PermissionsMixin, UpdateMixin, SoftDeleteMixin, CreateMixin):
    mobile_phone = models.CharField(_("mobile phone"), max_length=15, unique=True)
    username = models.CharField(_("username"), max_length=150, blank=True, null=True)
    email = models.EmailField(_("email address"), blank=True, null=True)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'mobile_phone'
    REQUIRED_FIELDS = ('email', "username")

    objects = UserManager()

    class Meta:
        db_table = "auth_user"


class Profile(CreateMixin, UpdateMixin, SoftDeleteMixin):
    user = models.OneToOneField(User, on_delete=models.PROTECT, related_name="profile")
    first_name = models.CharField(_("first name"), max_length=150, blank=True, null=True)
    last_name = models.CharField(_("last name"), max_length=150, blank=True, null=True)
    profile_image = models.ForeignKey(
        "core_app.Image",
        on_delete=models.PROTECT,
        related_name="profile_image",
        blank=True,
        null=True,
    )

    class Meta:
        db_table = "auth_profile"


class UserAddress(CreateMixin, UpdateMixin, SoftDeleteMixin):
    user = models.ForeignKey(
        User,
        on_delete=models.DO_NOTHING,
        related_name="addresses"
    )
    title = models.CharField(
        max_length=100,
        help_text="مثلاً خانه، محل کار، ..."
    )
    address_line = models.CharField(
        max_length=255,
        help_text=_("نشانی کامل (خیابان، پلاک، ...)")
    )
    postal_code = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        blank=True,
        null=True,
        help_text=_("عرض جغرافیایی")
    )
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        blank=True,
        null=True,
        help_text=_("طول جغرافیایی")
    )
    is_default = models.BooleanField(
        default=False,
        help_text=_("آیا آدرس پیش‌فرض کاربر است؟")
    )

    class Meta:
        db_table = "auth_user_address"


class PrivateNotification(CreateMixin, UpdateMixin, SoftDeleteMixin):
    user = models.ForeignKey(
        User,
        on_delete=models.DO_NOTHING,
        related_name="private_notifications"
    )
    title = models.CharField(max_length=255)
    body = models.TextField()
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "auth_private_notification"


class OtpService:
    @staticmethod
    def generate_otp(length=6, expiry_time=120):
        """Generate a numeric OTP and store it in Redis"""
        otp = ''.join([str(random.randint(0, 9)) for _ in range(length)])
        return otp

    @staticmethod
    def store_otp(key, otp, expiry_time=300):
        """Store OTP in Redis with expiry time (default: 5 minutes)"""
        cache.set(key, otp, timeout=expiry_time)

    @staticmethod
    def verify_otp(key, submitted_otp):
        """Verify the submitted OTP against stored OTP"""
        stored_otp = cache.get(key)
        if stored_otp is None:
            return False
        return stored_otp == submitted_otp

    @staticmethod
    def delete_otp(key):
        """Delete OTP from Redis"""
        cache.delete(key)
