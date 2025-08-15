from django.urls import path
from .views import UsersSuggestAPIView,UserFollowRequestAPIView,UserUnFollowRequestAPIView


urlpatterns=[

    path('users/suggest/',UsersSuggestAPIView.as_view(),name='user-suggest'),
    path('follow/request/',UserFollowRequestAPIView.as_view(),name='follow-request'),
    path('unfollow/request/',UserUnFollowRequestAPIView.as_view(),name='unfollow-request'),

]