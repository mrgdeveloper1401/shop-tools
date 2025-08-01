# import asyncio
import httpx
import json

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


def form_data_header(authorization=None):
    if authorization is None:
        auth = config("BASALAM_ACCESS_TOKEN", cast=str)
        authorization = auth
        return {
            # "Content-Type": "multipart/form-data",
            "Authorization": f"Bearer {authorization}",
        }

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
def upload_image_file(in_memory_image, file_type):
    with httpx.Client() as client:
        files = {"file": in_memory_image.file, "file_type": (None, file_type)}
        response = client.post(
            url=config("BA_SALAM_UPLOAD_IMAGE_URL", cast=str),
            files=files,
            headers=form_data_header(),
        )
    response.raise_for_status()
    return response.json()


@http_error
def upload_file(file_data, file_type):
    with httpx.Client() as client:
        file = {
            "file": file_data.file,
            "file_type": (None, file_type),
        }
        response = client.post(
            url=config("BA_SALAM_UPLOAD_FILE_URL", cast=str),
            files=file,
            headers=form_data_header(),
        )
    response.raise_for_status()
    return response.json()

@http_error
def read_categories(category_id=None):
    url = None
    if category_id is None:
        url = config("BA_SALAM_READ_CATEGORIES_URL", cast=str)
    else:
        url = config("BA_SALAM_READ_CATEGORIES_DETAIL_URL", cast=str).format(category_id)
    with httpx.Client() as client:
        response = client.get(
            url=url,
            headers=header(),
        )
    response.raise_for_status()
    return response.json()

@http_error
def create_product(*args, **kwargs):
    with httpx.Client() as client:
        json_data = {
            "name": kwargs.get("name"),
            "category_id": kwargs.get("category_id"),
            "status": kwargs.get("status"),
            "preparation_days": kwargs.get("preparation_days"),
            "photo": kwargs.get("photo"),
            "weight": kwargs.get("weight"),
            "package_weight": kwargs.get("package_weight"),
            "primary_price": kwargs.get("primary_price"),
            "stock": kwargs.get("stock"),
            "description": kwargs.get("description"),
            "is_wholesale": kwargs.get("is_wholesale")
            # "photos": kwargs.get("photos", []),
        }
        response = client.post(
            url=config("BA_SALAM_CREATE_PRODUCT_URL", cast=str).format(1140147),
            headers=header(),
            json=json_data,
        )
        response.raise_for_status()
        return response.json()

@http_error
def list_product(vendor_id):
    with httpx.Client() as client:
        response = client.get(
            url=config("BA_SALAM_PRODUCT_LIST", cast=str).format(vendor_id=vendor_id),
            headers=header(),
        )
        response.raise_for_status()
        return response.json()
