from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import UserPost, PostMedia
from .serializers import UserPostSerializer,PostMediaSerializer
from rest_framework import status

class CreateUserPostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UserPostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class PostMediaAPIView(APIView):
    permission_classes=[IsAuthenticated]

    def post(self,request):
        post_id=request.data.get('post_id')
        try:
             post = UserPost.objects.get(post_id=post_id, user=request.user)

        except UserPost.DoesNotExist:
            return Response({'error': 'Invalid post ID'}, status=status.HTTP_404_NOT_FOUND)

        serializer=PostMediaSerializer(data=request.data,files=request.FILES)
        if serializer.is_valid():
            serializer.save(post=post)
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class UserPostListAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_posts = UserPost.objects.filter(user=request.user).order_by('-created_at')
        
        if not user_posts.exists():
            return Response({'msg': 'No posts available'}, status=status.HTTP_204_NO_CONTENT)

        serializer = UserPostSerializer(user_posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
