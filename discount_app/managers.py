from django.db import models
from django.db.models import Q
from django.utils import timezone


class ProductDiscountQuerySet(models.QuerySet):
    def valid_discount(self):
        return self.filter(
            is_active=True,
            start_date__lte=timezone.now(),
            end_date__gte=timezone.now(),
        )


class ProductDiscountManager(models.Manager):
    def get_queryset(self):
        return ProductDiscountQuerySet(self.model, using=self._db)


class ValidCouponManager(models.Manager):
    def is_valid_coupon(self, coupon_code):
        from discount_app.models import Coupon
        try:
            coupon = self.filter(
                code=coupon_code,
                is_active=True,
                valid_from__lte=timezone.now(),
                valid_to__gte=timezone.now(),
            ).only("maximum_use", "number_of_uses")[0]
            if coupon:
                return coupon.number_of_uses < coupon.maximum_use
            return False
        except Coupon.DoesNotExist:
            return False
