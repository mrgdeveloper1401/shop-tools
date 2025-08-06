import random
# import uuid

from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin, UserManager
from django.core.cache import cache
from django.db import models
from django.utils.functional import cached_property
from django.utils.translation import gettext_lazy as _
from treebeard.mp_tree import MP_Node
# from django.utils import timezone

from core_app.models import UpdateMixin, SoftDeleteMixin, CreateMixin


# Create your models here.

class User(AbstractBaseUser, PermissionsMixin, UpdateMixin, SoftDeleteMixin, CreateMixin):
    mobile_phone = models.CharField(
        _("mobile phone"), 
        max_length=15,
        unique=True,
        null=True,
        blank=True
    )
    username = models.CharField(
        _("username"),
        max_length=150,
        blank=True,
        null=True
    )
    email = models.EmailField(
        _("email address"), 
        blank=True, 
        null=True, 
        # unique=True
    )
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    # activation_key = models.CharField(max_length=100, blank=True, null=True)
    # key_expires = models.DateTimeField(blank=True, null=True)

    USERNAME_FIELD = 'mobile_phone'
    REQUIRED_FIELDS = ('email', "username")

    objects = UserManager()

    class Meta:
        ordering = ("-id",)
        db_table = "auth_user"

    @cached_property
    def full_name(self):
        name = self.profile.full_name
        return name if name else None

    # def generate_activation_key(self):
    #     self.activation_key = str(uuid.uuid4())
    #     self.key_expires = timezone.now() + timezone.timedelta(days=1)
    #     self.save()
    #     return self.activation_key

    # def __str__(self):
    #     if self.mobile_phone:
    #         return self.mobile_phone
    #     else:
    #         return None

    # def __str__(self):
    #     return self.email


class Profile(CreateMixin, UpdateMixin, SoftDeleteMixin):
    user = models.OneToOneField(User, on_delete=models.PROTECT, related_name="profile")
    first_name = models.CharField(_("first name"), max_length=150, blank=True, null=True)
    last_name = models.CharField(_("last name"), max_length=150, blank=True, null=True)
    # display_name = models.CharField(_("display name"), max_length=150, blank=True, null=True)
    # full_name = models.CharField(_("full name"), max_length=150, blank=True, null=True)
    profile_image = models.ForeignKey(
        "core_app.Image",
        on_delete=models.PROTECT,
        related_name="profile_image",
        blank=True,
        null=True,
    )

    class Meta:
        ordering = ("-id",)
        db_table = "auth_profile"

    @cached_property
    def profile_image_url(self):
        return self.profile_image.image.url if self.profile_image else None


class State(models.Model):
    name = models.CharField(_("state name"), max_length=150)
    slug = models.SlugField(max_length=150, allow_unicode=True, null=True)
    tel_prefix = models.CharField(max_length=3, null=True)

    class Meta:
        db_table = "state"


class City(models.Model):
    name = models.CharField(_("city name"), max_length=150)
    state = models.ForeignKey(State, on_delete=models.PROTECT, related_name="cities")

    class Meta:
        db_table = "city"


class UserAddress(CreateMixin, UpdateMixin, SoftDeleteMixin):
    state = models.ForeignKey(
        State,
        on_delete=models.PROTECT,
        related_name="user_address_state",
    )
    city = models.ForeignKey(
        City,
        on_delete=models.PROTECT,
        related_name="user_address_city",
    )
    user = models.ForeignKey(
        User,
        on_delete=models.DO_NOTHING,
        related_name="addresses"
    )
    title = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text=_("مثلاً خانه، محل کار، ...")
    )
    address_line = models.CharField(
        max_length=255,
        help_text=_("نشانی کامل (خیابان، پلاک، ...)")
    )
    postal_code = models.CharField(
        max_length=20,
        db_index=True
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
        ordering = ("-id",)
        db_table = "auth_user_address"


class PrivateNotification(CreateMixin, UpdateMixin, SoftDeleteMixin):
    user = models.ForeignKey(
        User,
        on_delete=models.DO_NOTHING,
        related_name="private_notifications"
    )
    title = models.CharField(max_length=255)
    notif_type = models.CharField(max_length=100, blank=True, null=True, db_index=True) # TODO, when clean migration we remove property blank and null
    notifi_redirect_url = models.CharField(blank=True, null=True, max_length=255)
    body = models.TextField()
    is_read = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("-id",)
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


class TicketRoom(CreateMixin, UpdateMixin, SoftDeleteMixin):
    """
    create ticket room
    """
    user = models.ForeignKey(
        User,
        on_delete=models.DO_NOTHING,
        related_name="ticker_room",
        limit_choices_to={'is_active': True}
    )
    title_room = models.CharField(max_length=100, help_text=_("عنوان چت روم تیکت"))
    subject_room = models.CharField(max_length=50, help_text=_("موضوع تیکت"))
    is_active = models.BooleanField(default=True)
    is_close = models.BooleanField(default=False)

    class Meta:
        db_table = "ticker_room"
        ordering = ("-id",)


class Ticket(MP_Node, CreateMixin, UpdateMixin, SoftDeleteMixin):
    sender = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='ticket_sender',
        limit_choices_to={"is_active": True}
    )
    room = models.ForeignKey(
        TicketRoom,
        on_delete=models.PROTECT,
        related_name="tickets"
    )
    # reply = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name="ticket_reply", blank=True, null=True,
    #                           limit_choices_to={"is_staff": True, "is_active": True})
    ticket_body = models.TextField(_("متن تیکت"))
    ticket_file = models.FileField(upload_to="ticket/%Y/%m/%d", blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("id",)
        db_table = 'ticket'
