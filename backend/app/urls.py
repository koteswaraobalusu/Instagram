from django.urls import path
from .views import RequestOTPAPIView,RegisterVerifyOTPAPIView
urlpatterns=[

    path('register/request/',RequestOTPAPIView.as_view(),name='register-request'),
    path('register/verify/', RegisterVerifyOTPAPIView.as_view(),name='register-verify'),
    
]