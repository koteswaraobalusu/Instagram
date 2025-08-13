from django.urls import path
from .views import UsersSuggestAPIView,UserFollowRequestAPIView


urlpatterns=[

    path('users/suggest/',UsersSuggestAPIView.as_view(),name='user-suggest'),
    path('follow/request/',UserFollowRequestAPIView.as_view(),name='follow-request'),

]