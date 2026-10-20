from django.contrib.auth import get_user_model
from rest_framework import serializers

from activities.models import Activity
from games.serializers import GameSerializer
from media.serializers import MovieSeriesSerializer

User = get_user_model()


class ActivityUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']


class ActivitySerializer(serializers.ModelSerializer):
    user = ActivityUserSerializer(read_only=True)
    media_item = MovieSeriesSerializer(read_only=True)
    game = GameSerializer(read_only=True)

    class Meta:
        model = Activity
        fields = [
            'id',
            'user',
            'activity_type',
            'media_type',
            'media_item',
            'game',
            'from_status',
            'to_status',
            'created_at',
        ]
