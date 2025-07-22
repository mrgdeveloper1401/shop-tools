from django.db import models
from django.utils import timezone


class ProductDiscountManager(models.QuerySet):
    def valid_discount(self):
        return self.filter(
            is_active=True,
            start_date__lte=timezone.now(),
            end_date__gte=timezone.now()
        )
