from rest_framework.serializers import ModelSerializer
from .models import UserProfile
from app.models import CustomUser
from django.conf import settings
class UserProfileSerializer(ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['user',  'address', 'city','followers_count','following_count']
        read_only_fields = ['user']
    
class UserSerializer(ModelSerializer):
    class Meta:
        model=CustomUser
        fields=['id','username','email','bio','profile_picture','date_of_birth',]
        