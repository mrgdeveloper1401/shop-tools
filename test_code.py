from rest_framework.request import Request
from django.http import JsonResponse

def log_request(request: Request):
    # import ipdb
    # ipdb.set_trace()
    return JsonResponse(
        {"port": request.get_port()},
    )