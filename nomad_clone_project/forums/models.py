from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse
from django.utils.text import slugify
from django.utils import timezone # Import timezone

class ForumCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)

    class Meta:
        verbose_name_plural = 'forum categories'
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
            # Ensure slug uniqueness if auto-generating (simple version)
            original_slug = self.slug
            counter = 1
            while ForumCategory.objects.filter(slug=self.slug).exclude(pk=self.pk if self.pk else None).exists():
                self.slug = f'{original_slug}-{counter}'
                counter += 1
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('forums:category_threads', kwargs={'category_slug': self.slug})

class Thread(models.Model):
    category = models.ForeignKey(ForumCategory, related_name='threads', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    author = models.ForeignKey(User, related_name='threads', on_delete=models.CASCADE)
    initial_content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True) # Set to created_at initially, updated by posts

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('forums:thread_detail', kwargs={'thread_id': self.pk})

    @property
    def last_post_at(self): # More robust: check actual posts
        last_post = self.posts.order_by('-created_at').first()
        return last_post.created_at if last_post else self.created_at # Fallback to thread creation if no posts

    def save(self, *args, **kwargs):
        # updated_at is handled by Post save signal or if thread itself is edited.
        # If creating new thread, ensure updated_at is sensible (e.g. same as created_at)
        if self._state.adding and not self.updated_at: # If creating and updated_at not set
             self.updated_at = timezone.now() # Or self.created_at if it's already set by auto_now_add
        super().save(*args, **kwargs)


class Post(models.Model):
    thread = models.ForeignKey(Thread, related_name='posts', on_delete=models.CASCADE)
    author = models.ForeignKey(User, related_name='posts', on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) # If posts can be edited

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Reply by {self.author.username} in '{self.thread.title}'"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update thread's updated_at timestamp to now when a new post is saved
        self.thread.updated_at = timezone.now()
        self.thread.save(update_fields=['updated_at'])
