from rest_framework import views, permissions, response, mixins, viewsets, exceptions
from django.utils.translation import gettext_lazy as _

from apis.v1.third_party_app import serializers
from core.utils import ba_salam
from core.utils.pagination import FlexiblePagination
from core_app.models import Image


class GetUserInformation(views.APIView):
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request):
        user_info = ba_salam.get_user_information()
        return response.Response(user_info)


class CreateListImage(mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    """
    pagination --> limit&offset , default_limit = 20, max_limit = 100
    """
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = serializers.ImageUploadSerializer
    queryset = Image.objects.only("image", "image_id_ba_salam").filter(image_id_ba_salam__isnull=False)
    pagination_class = FlexiblePagination


class CreateProductView(views.APIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = serializers.CreateProductBaSalamSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        vendor_id = serializer.validated_data.pop('vendor_id')
        res = ba_salam.create_product(vendor_id=vendor_id, **serializer.validated_data)
        return response.Response(res)


class ListProductView(views.APIView):
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request):
        vendor_id = request.query_params.get('vendor_id')

        if vendor_id is None:
            raise exceptions.ValidationError(
                {
                    "message": _("you must defined parameters, vendor_id")
                }
            )
        res = ba_salam.list_product(vendor_id=vendor_id)
        return response.Response(res)
