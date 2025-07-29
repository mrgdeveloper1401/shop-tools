from rest_framework import views, permissions, response

from apis.v1.third_party_app import serializers
from core.utils import ba_salam
from core.utils.ba_salam import upload_image_file


class GetUserInformation(views.APIView):
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request):
        user_info = ba_salam.get_user_information()
        return response.Response(user_info)


class CreateImage(views.APIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = serializers.ImageUploadSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        image = serializer.save()

        result = upload_image_file(image.image.path)
        return response.Response(result)
