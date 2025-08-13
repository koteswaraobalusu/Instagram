from rest_framework import serializers
from app.models import CustomUser
from rest_framework.validators import ValidationError
import re

class RequestOTPSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomUser
        fields=['username','email','password']
        extra_kwargs={
            'password':{
                'write_only':True
            }
        }
    def validate_email(self,value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value


    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be 8 or more characters")
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Must contain at least one uppercase letter")
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("Must contain at least one lowercase letter")
        if not re.search(r'\d', value):
            raise serializers.ValidationError("Must contain at least one digit")
        if not re.search(r'[^a-zA-Z0-9]', value):
            raise serializers.ValidationError("Must contain at least one special character")
        return value
    

class VerifyOTPSerializer(serializers.Serializer):
    email=serializers.EmailField()
    otp=serializers.CharField(max_length=6)
    

from rest_framework import serializers
from django.contrib.auth import authenticate

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")

        if not user.check_password(password):
            raise serializers.ValidationError("Incorrect password.")

        # if not user.is_active:
        #     raise serializers.ValidationError("User account is disabled.")

        data['user'] = user
        print(data)
        return data



class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomUser
        fields=['id','username','email','profile_picture','bio','date_of_birth']



















# class RegisterUserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model=User
#         fields=['email','password']
#         extra_kwargs={
#             'password':{'write_only':True}
#         }

#     def validate_password(self,value):
#         if len(value)<8:
#             raise ValidationError("Password must contain 8 or more characters")
#         if not re.search(r'[A-Z]',value):
#             raise ValidationError("Password must contain atleast one uppercase character")
#         if not re.search(r'[a-z]',value):
#             raise ValidationError("Password must contain atleast one lowercase character")
#         if not re.search(r'\d',value):
#             raise ValidationError("Password must contain atleast one digit")
#         if not re.search(r'[^a-zA-Z0-9]',value):
#             raise ValidationError("Password must contain atleast one speacial character")
#         return value

#     def validate_email(self,value):
#         pattern = r'^[a-zA-Z0-9._%+-]+@gmail\.com$'
#         if not re.match(pattern, value):
#             raise ValidationError("Please enter a valid Gmail address.")
#         return value
    
        