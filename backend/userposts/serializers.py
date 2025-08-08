from rest_framework import serializers
from .models import UserPost,PostMedia

class PostMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model=PostMedia
        fields=['id','file','thumbnail']

class UserPostSerializer(serializers.ModelSerializer):
    media_files=PostMediaSerializer(many=True,read_only=True)
    class Meta:
        model=UserPost
        fields=['post_id','caption','created_at','user','media_files']
        read_only_fields=['user','post_id','created_at']

