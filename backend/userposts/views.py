from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import UserPost, PostMedia,PostLikes,PostComments
from .serializers import UserPostSerializer,PostMediaSerializer,UserSerializer,PostListCommentsSerializer
from rest_framework import status
from userprofile.models import UserFollowing
from app.models import CustomUser

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
        following_ids=list(UserFollowing.objects.filter(user=user).values_list('following_user_id', flat=True))

        followed_user_ids = following_ids + [user.id]
       
        followed_users=CustomUser.objects.filter(id__in=following_ids)
        non_followed_users=CustomUser.objects.exclude(id__in=following_ids)

        following_posts=UserPost.objects.filter(user__in=followed_users).order_by('-created_at')
        non_following_posts=UserPost.objects.filter(user__in=non_followed_users).order_by('-created_at')


        all_posts = list(following_posts)  + list(non_following_posts)

        serializer = UserPostSerializer(all_posts, many=True,context={'request': request,'following_ids': following_ids})
        if not serializer.data:
            return Response({'msg': 'No posts available'}, status=status.HTTP_204_NO_CONTENT)
        user=CustomUser.objects.get(id=user.id)
        user=UserSerializer(user)
        return Response({'posts':serializer.data,'user':user.data}, status=status.HTTP_200_OK)
    
class PostLikeAPIView(APIView):
    permission_classes=[IsAuthenticated]

    def post(self,request):
        user=request.user
        post_id=request.data.get('post_id')

        if not post_id:
            return Response({'error': 'post_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            post=UserPost.objects.get(post_id=post_id)
        except UserPost.DoesNotExist():
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        
        like, created = PostLikes.objects.get_or_create(post=post, user=user)

        if not created:
            return Response({'message': 'Already liked'}, status=status.HTTP_200_OK)


        return Response({'message': 'Post liked'}, status=status.HTTP_201_CREATED)

class PostUnlikeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        post_id = request.data.get('post_id')

        if not post_id:
            return Response({'error': 'post_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            post = UserPost.objects.get(post_id=post_id)
        except UserPost.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        deleted, _ = PostLikes.objects.filter(post=post, user=user).delete()

        if deleted:
            return Response({'message': 'Post unliked'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'You haven\'t liked this post'}, status=status.HTTP_400_BAD_REQUEST)

class PostListCommentsAPIView(APIView):

    def post(self,request):
        user=request.user
        post_id=request.data.get('post_id')

        if not post_id:
            return Response({'error': 'post_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            post=UserPost.objects.get(post_id=post_id)
        except UserPost.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        post_comments=PostComments.objects.filter(post=post)
        if not post_comments.exists():
            return Response({'comments': 'No comments'}, status=status.HTTP_200_OK)

        serializer=PostListCommentsSerializer(post_comments,many=True)
        
        return Response({'comments':serializer.data},status=status.HTTP_200_OK)