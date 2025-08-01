from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RequestOTPSerializer,VerifyOTPSerializer,UserLoginSerializer
from .models import EmailOTP
from django.core.mail import EmailMultiAlternatives
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer


from django.utils import timezone
from datetime import datetime
# Create your views here.
class RequestOTPAPIView(APIView):

    def post(self,request,format=None):
        serializer=RequestOTPSerializer(data=request.data)

        if serializer.is_valid():
            
            username=email=serializer.validated_data['email']
            password=serializer.validated_data['password']

            otp_object,created=EmailOTP.objects.get_or_create(email=email)
            otp_object.generate_otp()

            subject = "Your OTP Code"
            text_content = f"Your OTP is {otp_object.otp}"
            html_content = f"""
                            <p>Hello,</p>
                            <p>Your OTP is: <strong style="font-size: 24px;">{otp_object.otp}</strong></p>
                            <p>This OTP will expire in 5 minutes.</p>
                            """
            msg = EmailMultiAlternatives(subject, text_content, None, [email])
            msg.attach_alternative(html_content, "text/html")
            msg.send()

            request.session['pending_user'] = {'email': email, 'password': password } # store password temporarily
            print("Pending user from session:", request.session.get('pending_user'))
            print("All session keys:", list(request.session.keys()))
            return Response({"msg": "OTP sent to email"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class RegisterVerifyOTPAPIView(APIView):
    
    def post(self,request,format=None):
        serializer=VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = serializer.validated_data['otp']
            try:
                otp_obj = EmailOTP.objects.get(email=email)
            except EmailOTP.DoesNotExist:
                return Response({"error": "No OTP request found"}, status=status.HTTP_400_BAD_REQUEST)
            
            if otp_obj.otp != otp:
                return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST) 
            if timezone.now() - otp_obj.created_at > timezone.timedelta(minutes=5):

                response=Response({"error": "OTP is expired"}, status=status.HTTP_400_BAD_REQUEST)
                otp_obj.delete()
                del request.session['pending_user']
                return response


            print("Pending user from session:", request.session.get('pending_user'))
            print("All session keys:", list(request.session.keys()))
            pending_user = request.session.get('pending_user')
            if not pending_user or pending_user.get('email') != email:
                return Response({"error": "Password expired or not found"}, status=status.HTTP_400_BAD_REQUEST)

            password = pending_user.get('password')
            
            user = User.objects.create_user(username=email, email=email, password=password)

            otp_obj.delete()
            del request.session['pending_user']


            refresh = RefreshToken.for_user(user)
           
            response=Response({
                "msg": "User created and logged in",
                "refresh": str(refresh),
                "access": str(refresh.access_token)
            }, status=status.HTTP_201_CREATED)
            response.set_cookie('refresh', str(refresh), httponly=True, samesite='Lax', secure=False,sameSite='Lax',path='/',max_age=30*24*60*60)
            response.set_cookie('access', str(refresh.access_token), httponly=True, samesite='Lax', secure=False,sameSite='Lax',path='/',max_age=30*60)   
            return response
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class UserLoginAPIView(APIView):
    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            try:
                user = User.objects.get(email=email)
                if user.check_password(password):
                    refresh = RefreshToken.for_user(user)
                    response = Response({
                        "msg": "User logged in",
                        "refresh": str(refresh),
                        "access": str(refresh.access_token)
                    }, status=status.HTTP_200_OK)
                    response.set_cookie('refresh', str(refresh), httponly=True, samesite='Lax', secure=False)
                    response.set_cookie('access', str(refresh.access_token), httponly=True, samesite='Lax', secure=False)   
                    return response
                else:
                    return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                return Response({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'is_authenticated': True, 'username': request.user.username}, status=status.HTTP_200_OK)


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        response.delete_cookie('access')
        response.delete_cookie('refresh')
        return response






class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh')

        if not refresh_token:
            return Response({'detail': 'No refresh token in cookies'}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = TokenRefreshSerializer(data={'refresh': refresh_token})
        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            return Response({'detail': 'Invalid refresh token'}, status=status.HTTP_401_UNAUTHORIZED)

        access_token = serializer.validated_data.get('access')
        new_refresh_token = serializer.validated_data.get('refresh')  # ⬅️ Will be present if rotation is enabled

        response = Response({'message': 'Tokens refreshed'}, status=200)

        # ✅ Set new access token in cookie
        response.set_cookie(
            key='access',
            value=access_token,
            httponly=True,
            secure=False,  # Use True in production (HTTPS)
            samesite='Lax',
             # 5 minutes
        )

        # ✅ Set new refresh token in cookie (if rotation enabled)
        if new_refresh_token:
            response.set_cookie(
                key='refresh',
                value=new_refresh_token,
                httponly=True,
                secure=False,
                samesite='Lax',
                
            )

        return response

