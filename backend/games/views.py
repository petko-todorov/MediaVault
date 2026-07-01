from rest_framework import status
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

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

        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(
            self.get_serializer(instance).data,
            status=status_code
        )
