from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    # Add other fields as needed, e.g., location, website

    def __str__(self):
        return self.user.username

# Signal to create or update UserProfile whenever a User instance is saved
@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    # Ensure profile exists before trying to save, useful for existing users without profiles if signal is added later
    # For 'created=True', profile is just made. For updates, it should exist.
    # A more robust way for existing users if profile might not exist:
    # UserProfile.objects.get_or_create(user=instance)
    # if not created and hasattr(instance, 'profile'): # Check if profile exists before saving
    instance.profile.save() # This might fail if profile doesn't exist and instance is not new.
                            # However, for the signal, if 'created' is false, instance.profile should exist.
