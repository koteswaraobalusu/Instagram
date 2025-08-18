from rest_framework import serializers
from .models import UserPost,PostMedia,PostLikes,PostComments
from app.models import CustomUser
from userprofile.serializers import UserProfileSerializer

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
    is_following = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    
    class Meta:
        model=UserPost
        fields=['post_id','caption','created_at','user','media_files','is_following','likes_count']
        read_only_fields=['user','post_id','created_at']
    
    def get_likes_count(self, obj):
        return PostLikes.objects.filter(post=obj).count()
    

    def get_is_following(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        following_ids = self.context.get('following_ids', [])
        return obj.user.id in following_ids and obj.user.id != request.user.id
class MediaUploadSerializer(serializers.Serializer):
    post_id = serializers.UUIDField()
    media = serializers.ListField(
        child=serializers.FileField(),
        required=True
    )

class PostListCommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model=PostComments
        fields='__all__'
        read_only=['post','user']
