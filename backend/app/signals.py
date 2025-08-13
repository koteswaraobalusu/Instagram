from django.core.mail import EmailMultiAlternatives
from django.db.models.signals import post_save
from django.dispatch import receiver
from  django.conf import settings
from userprofile.models import UserProfile

from .models import CustomUser

@receiver(post_save,sender=CustomUser)
def send_user_creation_email(sender,instance,created,**kwargs):
    if created:
        subject="Welcome to Our Instagram!"
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email=instance.email
        text_content = f'Hello {instance.username},\n\nThank you for registering on our site.'
        html_content = f'''
            <html>
            <body>
                <h2>Welcome, {instance.username}!</h2>
                <p>Thank you for registering on our website Instagram.</p>
            </body>
            </html>
        '''
        msg = EmailMultiAlternatives(subject, text_content, from_email, [to_email])
        msg.attach_alternative(html_content,'text/html')
        msg.send()

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)