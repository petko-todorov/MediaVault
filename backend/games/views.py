from rest_framework import status
from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from activities.models import Activity
from games.models import UserGameLibrary
from games.serializers import UserGameLibrarySerializer


class GameLibraryView(ListAPIView):
    serializer_class = UserGameLibrarySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserGameLibrary.objects.filter(user=self.request.user).select_related('game')


class CreateGameView(CreateAPIView):
    serializer_class = UserGameLibrarySerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        instance, created = UserGameLibrary.objects.get_or_create(
            user=self.request.user,
            game=serializer.validated_data['game'],
        )

        if created:
            Activity.objects.create(
                user=self.request.user,
                activity_type='added',
                media_type='game',
                game=instance.game,
                to_status=instance.status,
            )

        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(
            self.get_serializer(instance).data,
            status=status_code
        )


class UpdateGameView(UpdateAPIView):
    serializer_class = UserGameLibrarySerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['patch']

    def get_queryset(self):
        return UserGameLibrary.objects.filter(user=self.request.user).select_related('game')

    def perform_update(self, serializer):
        old_status = serializer.instance.status
        instance = serializer.save()
        new_status = instance.status

        if old_status != new_status:
            Activity.objects.create(
                user=self.request.user,
                activity_type='status_change',
                media_type='game',
                game=instance.game,
                from_status=old_status,
                to_status=new_status,
            )

