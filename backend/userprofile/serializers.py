from rest_framework.serializers import ModelSerializer
from .models import UserProfile
from django.contrib.auth.models import User

class UserProfileSerializer(ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['user', 'bio', 'profile_picture', 'address', 'city']
        read_only_fields = ['user']
        