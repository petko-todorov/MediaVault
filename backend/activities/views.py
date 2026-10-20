from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated

from activities.models import Activity
from activities.serializers import ActivitySerializer


class ActivityPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50


class ActivityListView(ListAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = ActivityPagination

    def get_queryset(self):
        queryset = Activity.objects.all().select_related(
            'user', 'media_item', 'game'
        )

        scope = self.request.query_params.get('scope')
        if scope == 'me':
            queryset = queryset.filter(user=self.request.user)

        media_type = self.request.query_params.get('media_type')
        if media_type:
            if media_type in ['tv', 'series']:
                queryset = queryset.filter(media_type__in=['tv', 'series'])
            elif media_type in ['movie', 'game']:
                queryset = queryset.filter(media_type=media_type)

        return queryset

