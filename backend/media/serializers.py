from rest_framework import serializers
from media.models import MovieSeries

class MovieSeriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovieSeries
        fields = '__all__'
