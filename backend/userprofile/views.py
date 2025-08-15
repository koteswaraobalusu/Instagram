from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import UserSerializer
from .models import UserFollowing
from app.models import CustomUser
from rest_framework.response import Response
from django.contrib.auth import get_user_model
# Create your views here.
User=get_user_model()

class UsersSuggestAPIView(APIView):
    permission_classes=[IsAuthenticated]
   
    def get(self,request):
        user=request.user
        current_user=request.user.id
        following_ids=UserFollowing.objects.filter(user=user).values_list('following_user_id',flat=True)
        suggested_users=CustomUser.objects.exclude(id__in=following_ids).exclude(id=current_user)
        serializer=UserSerializer(suggested_users,many=True)
        return Response({'message':'Users Data','users':serializer.data})

class UserFollowRequestAPIView(APIView):
    permission_classes=[IsAuthenticated]

    def post(self,request):
        user=request.user
        following_id=request.data.get('id')

        if not following_id:
            return Response({'error': 'User ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            followee=CustomUser.objects.get(id=following_id)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User to follow not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        if user.id == followee.id:
            return Response({'error': 'You cannot follow yourself.'}, status=status.HTTP_400_BAD_REQUEST)
        if UserFollowing.objects.filter(user=user,following_user=followee):
            return Response({"message":'Already you are follwing this user'})
        follow = UserFollowing.objects.create(user=user, following_user=followee)

        return Response({
            'message': 'Follow request created successfully',
            'following_user_id': follow.following_user.id
        }, status=status.HTTP_201_CREATED)


class UserUnFollowRequestAPIView(APIView):
    permission_classes=[IsAuthenticated]

    def post(self,request):
        user=request.user
        unfollowing_id=request.data.get('id')

        if not unfollowing_id:
            return Response({"error": "Missing 'id' in request data."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            following_user=CustomUser.objects.get(id=unfollowing_id)
        except CustomUser.DoesNotExist:
            return Response({"error": "User to unfollow does not exist."},status=status.HTTP_404_NOT_FOUND)
        try:
            follow_relation=UserFollowing.objects.get(user=user,following_user=following_user)
        except UserFollowing.DoesNotExist:
            return Response({"error": "You are not following this user."},status=status.HTTP_404_NOT_FOUND)
        
        follow_relation.delete()
        return Response({"message": f"You have unfollowed {following_user.username}."},status=status.HTTP_200_OK)
