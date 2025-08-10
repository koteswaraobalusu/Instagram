from django.contrib import admin
from .models import UserProfile,UserFollowing
# Register your models here.
admin.site.register(UserProfile)
admin.site.register(UserFollowing)
