from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
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
        current_user=request.user.id
        following_ids=UserFollowing.objects.filter(id=current_user).values_list('following_user_id',flat=True)
        suggested_users=CustomUser.objects.exclude(id__in=following_ids).exclude(id=current_user)
        serializer=UserSerializer(suggested_users,many=True)
        return Response({'message':'Users Data','users':serializer.data})