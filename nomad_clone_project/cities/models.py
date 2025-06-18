from django.db import models
from django.urls import reverse
from django.utils.text import slugify # Import slugify

class City(models.Model):
    name = models.CharField(max_length=100, unique=True)
    country = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    hero_image = models.ImageField(upload_to='city_images/', blank=True, null=True)
    key_facts = models.TextField(blank=True, help_text="Store key facts, possibly as bullet points or simple JSON.")
    slug = models.SlugField(max_length=120, unique=True, blank=True, help_text="Leave blank to auto-generate from name.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'cities'
        ordering = ['name']

    def __str__(self):
        return f"{self.name}, {self.country}"

    def get_absolute_url(self):
        return reverse('cities:city_detail', kwargs={'slug': self.slug})

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
            # Ensure slug uniqueness if auto-generating
            original_slug = self.slug
            counter = 1
            # Check against existing slugs in the database
            while City.objects.filter(slug=self.slug).exclude(pk=self.pk if self.pk else None).exists():
                self.slug = f'{original_slug}-{counter}'
                counter += 1
        super().save(*args, **kwargs)
