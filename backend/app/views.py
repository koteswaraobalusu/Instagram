from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RequestOTPSerializer,VerifyOTPSerializer
from .models import EmailOTP
from django.core.mail import EmailMultiAlternatives
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
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
            return Response({"msg": "OTP sent to email"}, status=200)
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
                return Response({"error": "Invalid OTP"}, status=400)

            pending_user = request.session.get('pending_user')
            if not pending_user or pending_user.get('email') != email:
                return Response({"error": "Password expired or not found"}, status=status.HTTP_400_BAD_REQUEST)

            password = pending_user.get('password')
            
            user = User.objects.create_user(username=email, email=email, password=password)

            otp_obj.delete()
            del request.session['pending_user']


            refresh = RefreshToken.for_user(user)
            return Response({
                "msg": "User created and logged in",
                "refresh": str(refresh),
                "access": str(refresh.access_token)
            }, status=status.HTTP_201_CREATED)
                
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
