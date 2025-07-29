import asyncio
import httpx

from decouple import config

from core.utils.exceptions import http_error


def header(authorization=None):
    if authorization is None:
        auth = config("BASALAM_ACCESS_TOKEN", cast=str)
        authorization = auth
    return {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {authorization}",
    }


# def form_data_header(authorization=None):
#     if authorization is None:
#         auth = config("BASALAM_ACCESS_TOKEN", cast=str)
#         authorization = auth
#         return {
#             "Content-Type": "multipart/form-data",
#             "Authorization": f"Bearer {authorization}",
#         }

@http_error
def get_user_information():
    with httpx.Client() as client:
        response = client.get(
            url=config("GET_USER_INFORMATION_URL", cast=str),
            headers=header(),
        )
        response.raise_for_status()
        return response.json()


@http_error
def upload_image_file(image_path):
    with httpx.Client() as client:
        with open(image_path, "rb") as image_file:
            files = {"file": image_file, "file_type": (None, "product.photo")}
            response = client.post(
                url=config("BA_SALAM_UPLOAD_IMAGE_URL", cast=str),
                files=files,
                headers=header(),
            )
        response.raise_for_status()
        return response.json()


@http_error
def create_product(
        title,
        description,
        price,
        category_id,
        images: list[int],
        inventory,
        vendor_id,
        is_active=False,
):
    with httpx.Client() as client:
        json_data = {
            "title": title,
            "description": description,
            "price": price,
            "category_id": category_id,
            "images": images,
            "inventory": inventory,
            "is_active": is_active,
        }
        response = client.post(
            url=config("BA_SALAM_CREATE_PRODUCT_URL", cast=str).format(vendor_id),
            headers=header(),
            json=json_data,
        )
        response.raise_for_status()
        return response.json()
