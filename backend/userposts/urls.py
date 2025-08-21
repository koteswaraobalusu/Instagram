from django.urls import path
from .views import CreateUserPostView,PostMediaAPIView,UserPostListAPIView,PostLikeAPIView,PostUnlikeAPIView,PostListCommentsAPIView,PostDeleteAPIView,PostDetailsAPIView

urlpatterns=[
    path('post/create/',CreateUserPostView.as_view(),name='post-create'),
    path('post/upload/',PostMediaAPIView.as_view(),name='post-save'),
    path('user/posts/',UserPostListAPIView.as_view(),name='user-posts'),
    path('post/<uuid:post_id>/',PostDetailsAPIView.as_view(),name='post-detail'),
    path('post/like/',PostLikeAPIView.as_view(),name='post-like'),
    path('post/unlike/',PostUnlikeAPIView.as_view(),name='post-unlike'),
    path('post/comments/',PostListCommentsAPIView.as_view(),name='post-comments'),
    path('post/delete/',PostDeleteAPIView.as_view(),name='post-delete'),
]