from rest_framework import serializers

from media.models import MovieSeries, UserMediaLibrary


class MovieSeriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovieSeries
        fields = '__all__'


class UserMediaLibrarySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserMediaLibrary
        fields = ['id', 'media_item', 'status', 'personal_rating', 'added_at']
        read_only_fields = ['id', 'added_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['media_item'] = MovieSeriesSerializer(instance.media_item).data
        return representation
