from rest_framework import views, permissions, response, mixins, viewsets, exceptions
from django.utils.translation import gettext_lazy as _

from apis.v1.third_party_app import serializers
from core.utils import ba_salam
from core.utils.ba_salam import read_categories
from core.utils.pagination import FlexiblePagination
from core_app.models import Image, UploadFile


class GetUserInformation(views.APIView):
    """
    دریافت اطلاعات کاربر غرفه
    """
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request):
        user_info = ba_salam.get_user_information()
        resp = response.Response(user_info)
        resp.headers.pop('Pragma', None)
        resp.headers.pop('Expires', None)
        resp['Cache-Control'] = 'public, max-age=3600'
        return resp


class CreateListImage(mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    """
    pagination --> limit&offset , default_limit = 20, max_limit = 100
    ایجاد عکس برای محصول \n
    file type is --> PRODUCT_PHOTO = 'product.photo'
    """
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = serializers.ImageUploadSerializer
    queryset = Image.objects.only(
        "image",
        "image_id_ba_salam",
        "wp_image_url",
        "created_at"
    ).filter(
        image_id_ba_salam__isnull=False
    )
    pagination_class = FlexiblePagination


class CreateProductView(views.APIView):
    """
    ایجاد محصول یک غرفه \n
    status --> (published, 2976), (draft, 3970), (illegal, 4184), (waiting, 3568)
    """
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = serializers.CreateProductBaSalamSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        # vendor_id = serializer.validated_data.pop('vendor_id', None)
        res = ba_salam.create_product(**serializer.validated_data)
        return response.Response(res)


class ListProductView(views.APIView):
    """
    نمایش لیست محصولات یک غرفه
    """
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


class CreateListUploadFileViewSet(mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    """
    pagination --> limit&offset , default_limit = 20, max_limit = 100 \n
    if you can upload video , max_duration=300 second, max_size = 120M / image --> max_size = 5M
    """
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = serializers.UploadFileSerializer
    queryset = UploadFile.objects.only(
        "file",
        "file_id_ba_salam"
    ).filter(
        file_id_ba_salam__isnull=False
    )
    pagination_class = FlexiblePagination


class ReadCategoryView(views.APIView):
    """
    detail_data --> send category id --> https://core.basalam.com/v3/categories/1/ \n
    permission --> admin user
    """
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request, category_id=None):
        res = read_categories(category_id)
        resp = response.Response(res)
        resp['Cache-Control'] = 'public, max-age=3600'
        # حذف هدرهای مخرب کش (اگر وجود دارند)
        resp.headers.pop('Pragma', None)
        resp.headers.pop('Expires', None)
        return resp