# from rest_framework.request import Request
# from django.http import JsonResponse
#
# def log_request(request: Request):
#     # import ipdb
#     # ipdb.set_trace()
#     return JsonResponse(
#         {"port": request.get_port()},
#     )

# PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹"
# ARABIC_DIGITS  = "٠١٢٣٤٥٦٧٨٩"
# ASCII_DIGITS   = "0123456789"
#
# TRANSLATION_TABLE = str.maketrans(
#     PERSIAN_DIGITS + ARABIC_DIGITS,
#     ASCII_DIGITS * 2
# )
#
#
# def normalize_digits(value: str) -> str:
#     """
#     Convert Persian/Arabic digits to ASCII digits.
#     Only runs translation if non-ASCII characters exist.
#     """
#     if not value:
#         return value
#
#     if value.isascii():
#         return value
#
#     return value.translate(TRANSLATION_TABLE)
#
# number = "۰۹۱۲۳۴۷۹۴۱۲"
# print(normalize_digits(number))

