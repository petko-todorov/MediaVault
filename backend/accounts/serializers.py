from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

# TODO: add more fields
class UserMeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name']
