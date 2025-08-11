from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
# Create your models here.

class UserProfile(models.Model):
    user=models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    bio=models.TextField(blank=True)
    profile_picture=models.ImageField(upload_to='profile_pictures/',blank=True,default='profile_pictures/default_profile.png')
    address=models.CharField(max_length=255,blank=True)
    city=models.CharField(max_length=100,blank=False)


    def __str__(self):
        return self.user.username

class UserFollowing(models.Model):
    user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='following',help_text='The user who is following others')
    following_user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='followers',help_text='The user being followed')
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def following_count(self):
        self.following_count()