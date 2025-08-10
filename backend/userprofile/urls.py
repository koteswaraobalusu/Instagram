from django.urls import path
from .views import UsersSuggestAPIView


urlpatterns=[

    path('users/suggest/',UsersSuggestAPIView.as_view(),name='user-suggest'),

]