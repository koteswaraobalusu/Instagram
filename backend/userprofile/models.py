from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
# Create your models here.

class UserProfile(models.Model):
    user=models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    address=models.CharField(max_length=255,blank=True)
    city=models.CharField(max_length=100,blank=True)
    
    def __str__(self):
        return self.user.username
    
    @property
    def followers_count(self):
        return self.user.followers.count()
    
    @property
    def following_count(self):
        return self.user.following.count()

class UserFollowing(models.Model):
    user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='following',help_text='The user who is following others')
    following_user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='followers',help_text='The user being followed')
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f'{self.user.username}-{self.following_user.username}'