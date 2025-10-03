# import asyncio
import httpx
import json

from decouple import config
from rest_framework import exceptions

from core.utils.exceptions import http_error


def header(authorization=None):
    if authorization is None:
        auth = config("BASALAM_ACCESS_TOKEN", cast=str)
        authorization = auth
    return {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {authorization}",
        "Accept": "application/json",
    }


def form_data_header(authorization=None):
    if authorization is None:
        auth = config("BASALAM_ACCESS_TOKEN", cast=str)
        authorization = auth
        return {
            # "Content-Type": "multipart/form-data",
            "Authorization": f"Bearer {authorization}",
            "Accept": "application/json"
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
        files = {"file": in_memory_image, "file_type": (None, file_type)}
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
def read_category_attribute(category_id=None):
    url = config("BA_SALAM_READ_CATEGORY_ATTRIBUTE", cast=str).format(category_id)
    with httpx.Client() as client:
        response = client.get(
            url=url,
            headers=header(),
        )
    response.raise_for_status()
    return response.json()

# @http_error
def create_product(*args, **kwargs):
    try:
        with httpx.Client() as client:
            json_data = {
                "name": kwargs.get("name"),
                "category_id": kwargs.get("category_id"),
                "status": kwargs.get("status"),
                "preparation_days": kwargs.get("preparation_days"),
                "weight": kwargs.get("weight"),
                "package_weight": kwargs.get("package_weight"),
                "primary_price": kwargs.get("primary_price"),
                "stock": kwargs.get("stock"),
                "description": kwargs.get("description"),
                "is_wholesale": kwargs.get("is_wholesale"),
                "sku": kwargs.get("sku"),
                "photo": kwargs.get("photo"),
            }
            json_data = {k: v for k, v in json_data.items() if v is not None}
            response = client.post(
                url=config("BA_SALAM_CREATE_PRODUCT_URL", cast=str).format(1140147),
                headers=header(),
                json=json_data,
            )
            
            # بررسی وضعیت پاسخ
            if response.status_code != 200:
                error_detail = response.json() if response.content else response.text
                raise exceptions.ValidationError({
                    "status": False,
                    "http_status": response.status_code,
                    "messages": error_detail
                })
                
            return response.json()
    except Exception as e:
        raise exceptions.ValidationError({
            "status": False,
            "message": str(e)
        })

@http_error
def list_product(vendor_id):
    with httpx.Client() as client:
        response = client.get(
            url=config("BA_SALAM_PRODUCT_LIST", cast=str).format(vendor_id=vendor_id),
            headers=header(),
        )
        response.raise_for_status()
        return response.json()


@http_error
def list_retrieve_product(product_id=None, page_id=None):
    base_url = config("BA_SALAM_READ_PRODUCT_URL", cast=str)

    params = {}

    if product_id:
        base_url = config("BA_SALAM_READ_PRODUCT_DETAIL_URL", cast=str).format(product_id)
    if page_id:
        params["page"] = page_id

    with httpx.Client() as client:
        response = client.get(
            url=base_url,
            headers=header(),
            params=params,
        )
        response.raise_for_status()
        return response.json()


@http_error
def patch_update_product_ba_salam(product_id, **kwargs):
    with httpx.Client() as client:
        response = client.patch(
            url=config("BA_SALAM_PATCH_UPDATE_PRODUCT", cast=str).format(product_id),
            headers=header(),
            json=kwargs
        )
        response.raise_for_status()
        return response.json()
