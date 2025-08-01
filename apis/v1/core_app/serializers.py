from rest_framework import serializers

from core_app.models import PublicNotification, Image, MainSite, Carousel, SitemapEntry, UploadFile


class PublicNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicNotification
        fields = (
            "id",
            "title",
            "body",
            "created_at"
        )


class AdminImageSerializer(serializers.ModelSerializer):
    # uploaded_by = serializers.PrimaryKeyRelatedField(
    #     queryset=User.objects.filter(is_active=True).only("mobile_phone"),
    # )

    class Meta:
        model = Image
        exclude = (
            "is_deleted",
            "deleted_at"
        )


class SimpleImageUrlSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = (
            "get_image_url",
        )

class MainSiteSerializer(serializers.ModelSerializer):
    images = serializers.PrimaryKeyRelatedField(
        queryset=Image.objects.only("image"),
        many=True,
        required=False
    )

    class Meta:
        model = MainSite
        exclude = (
            "is_deleted",
            "deleted_at",
            "created_at",
            "updated_at"
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['images'] = SimpleImageUrlSerializer(instance.images, many=True, read_only=True).data
        return data

    def get_fields(self):
        admin_user = self.context['request'].user.is_staff
        field = super().get_fields()

        if not admin_user:
            field.pop("is_publish", None)

        return field


class CarouselSerializer(serializers.ModelSerializer):
    image = serializers.PrimaryKeyRelatedField(
        queryset=Image.objects.only("image", "id"),
        required=False
    )
    image_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        return obj.image.get_image_url if obj.image else None

    class Meta:
        model = Carousel
        fields = ("id", "image", "image_url", "name")



class SiteMapSerializer(serializers.ModelSerializer):
    class Meta:
        model = SitemapEntry
        exclude = (
            "is_deleted",
            "deleted_at"
        )
