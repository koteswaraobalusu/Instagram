from django.contrib import admin
from .models import UserPost,PostMedia,PostLikes,PostComments


# Register your models here.
admin.site.register(UserPost)
admin.site.register(PostMedia)
admin.site.register(PostLikes)
admin.site.register(PostComments)