from urllib.parse import urlparse

from django.utils.functional import cached_property
from rest_framework import views, permissions, response, mixins, viewsets, exceptions
from django.utils.translation import gettext_lazy as _
from django.db.models import Prefetch
from adrf.views import APIView as AsyncAPIView
from apis.v1.third_party_app import serializers
from core.utils import ba_salam
from core.utils.ba_salam import read_categories, list_retrieve_product
from core.utils.pagination import FlexiblePagination
from core_app.models import Image, UploadFile
from product_app.models import ProductVariant, Product, ProductImages, ProductAttributeValues
from product_app.tasks import update_product_id_ba_salam
from core.utils.pagination import TorobPagination
from drf_spectacular.utils import extend_schema


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
    status --> (published, 2976), (draft, 3790), (illegal, 4184), (waiting, 3568) \n
    product_id --> product_id our one system
    """
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = serializers.CreateProductBaSalamSerializer

    def post(self, request, *args, **kwargs):
        product_id = kwargs.get("product_id")

        if product_id is None:
            raise exceptions.ValidationError(
                {
                    "message": _("product id is required")
                }
            )

        product = Product.objects.filter(id=product_id).only("id", "product_id_ba_salam")

        if not product.exists():
            raise exceptions.ValidationError(
                {
                    "message": _("product id not found")
                }
            )
        if product.first().product_id_ba_salam:
            raise exceptions.ValidationError(
                {
                    "message": _("product have product_id_ba_salam")
                }
            )

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        res = ba_salam.create_product(**serializer.validated_data)

        update_product_id_ba_salam.delay(product, res['id'])

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


class ReadCategoryAttributes(views.APIView):
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request, category_id=None):
        res = ba_salam.read_category_attribute(category_id)
        return response.Response(res)


class ListRetrieveProductView(views.APIView):
    """
    pagination --> ?page=number
    """
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request, *args, **kwargs):
        product_id = kwargs.get('product_id', None)
        page_id = request.query_params.get('page', None)

        res = None

        if page_id:
            res = list_retrieve_product(page_id=page_id)
        if product_id:
            res = list_retrieve_product(product_id=product_id)
        if product_id is None and page_id is None:
            res = list_retrieve_product()
        return response.Response(res)


class UpdateProductView(views.APIView):
    """
    status --> (published, 2976), (draft, 3970), (illegal, 4184), (waiting, 3568)
    """
    serializer_class = serializers.UpdateProductSerializer
    permission_classes = (permissions.IsAdminUser,)

    def patch(self, request, *args, **kwargs):
        product_id = kwargs.get('product_id')

        if product_id is None:
            raise exceptions.ValidationError(
                {
                    "message": _("product_id is required")
                }
            )
        else:
            product = Product.objects.filter(id=product_id).only("id", "product_id_ba_salam")
            if not product.exists():
                raise exceptions.ValidationError(
                    {
                        "message": _("product_id is invalid")
                    }
                )
            else:
                if product[0].product_id_ba_salam is None:
                    raise exceptions.ValidationError(
                        {
                            "message": _("this product doesn't have product_id_ba_salam")
                        }
                    )

        product_id_ba_salam = product[0].product_id_ba_salam
        serializer = self.serializer_class(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        res = ba_salam.patch_update_product_ba_salam(product_id_ba_salam, **serializer.validated_data)
        return response.Response(res)


class TorobProductView(AsyncAPIView):
    serializer_class = serializers.PostRequestTorobSerializer
    pagination_class = TorobPagination

    def parse_url(self, url):
        parse = urlparse(url)
        split_url = parse.path.split("/")
        number = None
        if isinstance(split_url[-1], int):
            number = split_url[-1]
        else:
            number = split_url[-2]
        return number

    @cached_property
    def get_empty_response(self):
        return {
            "api_version": "torob_api_v3",
            "current_page": 1,
            "total": 0,
            "max_pages": 1,
            "products": [] 
        }

    def not_empty_reponse(self, data):
        return {
            "api_version": "torob_api_v3",
            "current_page": 1,
            "total": 0,
            "max_pages": 1,
            "products": [data] 
        }

    def get_queryset(self):
        return ProductVariant.objects.filter(
            is_active=True
            ).select_related(
                "product__category"
            ).only(
                "product__product_slug",
                "product__category__category_name",
                "price",
                "name",
                "subtitle",
                "short_desc",
                "is_active",
                "stock_number",
                "old_price",
                "created_at",
                "updated_at"
            ).prefetch_related(
                Prefetch(
                    "product__product_product_image",
                    queryset=ProductImages.objects.filter(is_active=True).select_related("image").only(
                        "image__image",
                        "product_id"
                    )
                ),
                Prefetch(
                    "product__attributes",
                    queryset=ProductAttributeValues.objects.select_related("attribute").only(
                        "product_id",
                        "attribute__attribute_name",
                        "value"
                    )
                )
            )

    @extend_schema(
        methods=['POST'],
        responses={
            200: serializers.TrobSerializer
        }
    )
    def post(self, request):
        # import ipdb
        # ipdb.set_trace()
        serializer = self.serializer_class(data=request.data) # data
        serializer.is_valid(raise_exception=True) # validate data

        page_unique = serializer.validated_data.get("page_uniques", None) # get data
        page = serializer.validated_data.get("page", None) # get data
        sort = serializer.validated_data.get("sort", None) # get data
        page_urls = serializer.validated_data.get("page_urls", None) # get data

        query = None

        if page_unique: # check data page_unique dose exists
            query = self.get_queryset().filter(id=int(page_unique[0])).first()
            if query is None:
                return response.Response(data=self.get_empty_response)
            serializer = serializers.TrobSerializer(query)
            data = self.not_empty_reponse(serializer.data)
            return response.Response(data)

        if page and sort:
            # import ipdb
            # ipdb.set_trace()
            paginator = self.pagination_class()
            queryset = None
            if sort == "date_added_desc":
                queryset = self.get_queryset()
            elif sort == "date_updated_desc":
                queryset = self.get_queryset().order_by("-updated_at")
            else:
                raise exceptions.ValidationError({"error": "sort must be (date_updated_desc) or (date_added_desc)"})
            p = paginator.paginate_queryset(queryset=queryset, request=request, view=self)
            serializer = serializers.TrobSerializer(p, many=True)
            return paginator.get_paginated_response(serializer.data)

        if page_urls:
            # import ipdb
            # ipdb.set_trace()
            get_url = page_urls[0]
            get_number = self.parse_url(get_url)
            query = self.get_queryset().filter(id=int(get_number)).first()
            if query is None:
                return response.Response(self.get_empty_response)
            else:
                serializer = serializers.TrobSerializer(query)
                data = self.not_empty_reponse(serializer.data)
                return response.Response(data)
