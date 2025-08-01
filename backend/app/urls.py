from django.urls import path
from .views import RequestOTPAPIView,RegisterVerifyOTPAPIView,UserLoginAPIView,ProtectedView,LogoutAPIView,CookieTokenRefreshView
urlpatterns=[

    path('register/request/',RequestOTPAPIView.as_view(),name='register-request'),
    path('register/verify/', RegisterVerifyOTPAPIView.as_view(),name='register-verify'),
    path('login/', UserLoginAPIView.as_view(), name='user-login'),
    path('protected/', ProtectedView.as_view(), name='protected-view'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='refresh_token'),

    
]