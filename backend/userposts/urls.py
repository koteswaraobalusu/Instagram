from django.urls import path
from .views import CreateUserPostView,PostMediaAPIView,UserPostListAPIView

urlpatterns=[
    path('post/create/',CreateUserPostView.as_view(),name='post-create'),
    path('post/upload/',PostMediaAPIView.as_view(),name='post-save'),
    path('userposts/',UserPostListAPIView.as_view(),name='user-posts'),

]