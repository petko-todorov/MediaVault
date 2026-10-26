from rest_framework import status
from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from activities.models import Activity
from media.models import UserMediaLibrary
from media.serializers import UserMediaLibrarySerializer


class MediaLibraryView(ListAPIView):
    serializer_class = UserMediaLibrarySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserMediaLibrary.objects.filter(user=self.request.user).select_related('media_item')


class CreateMediaView(CreateAPIView):
    serializer_class = UserMediaLibrarySerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        instance, created = UserMediaLibrary.objects.get_or_create(
            user=self.request.user,
            media_item=serializer.validated_data['media_item'],
        )

        if created:
            Activity.objects.create(
                user=self.request.user,
                activity_type='added',
                media_type=instance.media_item.media_type,
                media_item=instance.media_item,
                to_status=instance.status,
            )

        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(
            self.get_serializer(instance).data,
            status=status_code
        )


class UpdateMediaView(UpdateAPIView):
    serializer_class = UserMediaLibrarySerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['patch']

    def get_queryset(self):
        return UserMediaLibrary.objects.filter(user=self.request.user).select_related('media_item')

    def perform_update(self, serializer):
        old_status = serializer.instance.status
        instance = serializer.save()
        new_status = instance.status

        if old_status != new_status:
            Activity.objects.create(
                user=self.request.user,
                activity_type='status_change',
                media_type=instance.media_item.media_type,
                media_item=instance.media_item,
                from_status=old_status,
                to_status=new_status,
            )

