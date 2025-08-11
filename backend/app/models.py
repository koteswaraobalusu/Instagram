from django.db import models
from django.contrib.auth.models import AbstractUser
import random
# Create your models here.
class CustomUser(AbstractUser):
    bio=models.TextField(blank=True,null=True)
    profile_picture=models.ImageField(upload_to='profiles/',blank=True,null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.username


class EmailOTP(models.Model):
    email=models.EmailField(unique=True)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def generate_otp(self):
        self.otp=str(random.randint(100000,999999))
        self.save()
