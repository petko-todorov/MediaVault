from rest_framework import serializers

from games.models import Game, UserGameLibrary


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'


class UserGameLibrarySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserGameLibrary
        fields = ['id', 'game', 'status', 'personal_rating', 'added_at']
        read_only_fields = ['id', 'added_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['game'] = GameSerializer(instance.game).data
        return representation
