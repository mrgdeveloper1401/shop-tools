from rest_framework import pagination


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
