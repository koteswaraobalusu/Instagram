from rest_framework import serializers
from .models import UserPost,PostMedia
from app.models import CustomUser

class PostMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model=PostMedia
        fields=['id','file','thumbnail']
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomUser
        fields=['id', 'username', 'email', 'profile_picture']
class UserPostSerializer(serializers.ModelSerializer):
    media_files=PostMediaSerializer(many=True,read_only=True)
    user=UserSerializer(read_only=True)
    class Meta:
        model=UserPost
        fields=['post_id','caption','created_at','user','media_files']
        read_only_fields=['user','post_id','created_at']

class MediaUploadSerializer(serializers.Serializer):
    post_id = serializers.UUIDField()
    media = serializers.ListField(
        child=serializers.FileField(),
        required=True
    )