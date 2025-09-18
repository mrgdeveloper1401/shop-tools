from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _


class PhoneNumberValidator(RegexValidator):
    regex = r'^\d{11}$'
    message = _("phone number must be digit and eleven number")
