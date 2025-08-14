from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
import uuid

def post_media_path(instance, filename):
    return f'userposts/{instance.post.user.id}/{instance.post.id}/{filename}'

def validate_file_type_and_size(file):
    content_type = getattr(file, 'content_type', None)
    if content_type is None:
        raise ValidationError("Cannot determine file type")

    valid_mime_types = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4']
    max_file_size = 5 * 1024 * 1024  # 5 MB

    if content_type not in valid_mime_types:
        raise ValidationError('Unsupported file type. Allowed types: JPG, PNG, WEBP, MP4.')

    if file.size > max_file_size:
        raise ValidationError('File too large. Max size: 5 MB.')

class UserPost(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    caption = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.created_at.strftime('%Y-%m-%d %H:%M:%S')}"

class PostMedia(models.Model):
    post = models.ForeignKey(UserPost, on_delete=models.CASCADE, related_name='media_files')
    file = models.FileField(upload_to=post_media_path, validators=[validate_file_type_and_size])
    thumbnail = models.ImageField(upload_to=post_media_path, blank=True, null=True)  # Optional for videos

    def __str__(self):
        return f"{self.post.user.username} - {self.post.post_id}"
