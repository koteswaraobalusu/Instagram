from django.db import models
from django.contrib.auth.models import User
import random
# Create your models here.
class EmailOTP(models.Model):
    email=models.EmailField(unique=True)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def generate_otp(self):
        self.otp=str(random.randint(100000,999999))
        self.save()
