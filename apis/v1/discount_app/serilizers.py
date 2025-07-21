from rest_framework import serializers

from discount_app.models import Coupon

class AdminCouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        exclude = (
            "deleted_at",
            "is_deleted"
        )
