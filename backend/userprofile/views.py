from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .serializers import UserSerializer
from .models import UserFollowing
from rest_framework.response import Response
# Create your views here.
class UsersSuggestAPIView(APIView):
    permission_classes=[IsAuthenticated]
    

    def get(self,request):
        current_user=request.user.id
        following_ids=UserFollowing.objects.filter(id=current_user).values_list('following_user_id',flat=True)
        suggested_users=User.objects.exclude(id__in=following_ids).exclude(id=current_user)
        serializer=UserSerializer(suggested_users,many=True)
        return Response({'message':'Users Data','users':serializer.data})