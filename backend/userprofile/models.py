from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class UserProfile(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    bio=models.TextField(blank=True)
    profile_picture=models.ImageField(upload_to='profile_pictures/',blank=True,default='profile_pictures/default_profile.png')
    address=models.CharField(max_length=255,blank=True)
    city=models.CharField(max_length=100,blank=False)


    def __str__(self):
        return self.user.username

