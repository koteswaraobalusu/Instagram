from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import UserPost, PostMedia
from .serializers import UserPostSerializer,PostMediaSerializer
from rest_framework import status
from userprofile.models import UserFollowing

class CreateUserPostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UserPostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostMediaAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        post_id = request.data.get('post_id')

        # Validate post existence
        try:
            post = UserPost.objects.get(post_id=post_id, user=request.user)
        except UserPost.DoesNotExist:
            return Response({'error': 'Invalid post ID'}, status=status.HTTP_404_NOT_FOUND)

        # Get all media files
        files = request.FILES.getlist('media')
        if not files:
            return Response({'error': 'No media files provided'}, status=status.HTTP_400_BAD_REQUEST)

        uploaded_media = []
        errors = []

        # Process each file individually
        for file in files:
            serializer = PostMediaSerializer(data={'file': file})
            if serializer.is_valid():
                serializer.save(post=post)
                uploaded_media.append(serializer.data)
            else:
                errors.append({file.name: serializer.errors})

        # Handle errors or return success
        if errors:
            return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            'message': 'Media uploaded successfully',
            'uploaded_media': uploaded_media
        }, status=status.HTTP_201_CREATED)
    
class UserPostListAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user=request.user
        following_ids=UserFollowing.objects.filter(user=user).values_list('following_user_id', flat=True)
        all_user_ids = list(following_ids) + [user.id]
        user_posts = UserPost.objects.filter(user__in=all_user_ids).order_by('-created_at')

        if not user_posts.exists():
            return Response({'msg': 'No posts available'}, status=status.HTTP_204_NO_CONTENT)

        serializer = UserPostSerializer(user_posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
