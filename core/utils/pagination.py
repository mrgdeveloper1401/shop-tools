from rest_framework import pagination, response
from django.utils.functional import cached_property
from rest_framework.exceptions import ValidationError

class TwentyPageNumberPagination(pagination.PageNumberPagination):
    page_size = 20


class AdminTwentyPageNumberPagination(pagination.PageNumberPagination):
    page_size = 20

    def paginate_queryset(self, queryset, request, view=None):
        if request.user.is_staff:
            return super().paginate_queryset(queryset, request, view)


class FlexiblePagination(pagination.LimitOffsetPagination):
    default_limit = 20
    max_limit = 100


class TorobPagination(pagination.PageNumberPagination):
    page_size = 100

    def get_page_number(self, request, paginator):
        if request.method == 'POST' and 'page' in request.data:
            try:
                return int(request.data['page'])
            except Exception as e:
                raise ValidationError(e)
        return super().get_page_number(request, paginator)

    @cached_property
    def max_page(self):
        total = self.page.paginator.count
        page_size = self.page_size
        return (total + page_size - 1) // page_size

    def get_paginated_response(self, data=None):
        return response.Response({
            "api_version": "torob_api_v3",
            'total': self.page.paginator.count,
            "max_pages": self.max_page,
            "current_page": self.page.number,
            # 'next': self.get_next_link(),
            # 'previous': self.get_previous_link(),
            'products': data,
        })
