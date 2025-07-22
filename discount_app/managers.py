from django.db import models
from django.db.models import Q
from django.utils import timezone


class ProductDiscountQuerySet(models.QuerySet):
    def valid_discount(self):
        return self.filter(
            is_active=True,
            start_date__lte=timezone.now(),
            end_date__gte=timezone.now(),
        ).filter(
            Q(is_deleted=False, is_deleted__isnull=True)
        )


class ProductDiscountManager(models.Manager):
    def get_queryset(self):
        return ProductDiscountQuerySet(self.model, using=self._db).filter(
            Q(is_deleted=False, is_deleted__isnull=True)
        )
