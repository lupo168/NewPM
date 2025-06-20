# Generated by Django 4.2 on 2025-06-18 05:01

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="City",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100, unique=True)),
                ("country", models.CharField(max_length=100)),
                ("description", models.TextField(blank=True)),
                (
                    "hero_image",
                    models.ImageField(blank=True, null=True, upload_to="city_images/"),
                ),
                (
                    "key_facts",
                    models.TextField(
                        blank=True,
                        help_text="Store key facts, possibly as bullet points or simple JSON.",
                    ),
                ),
                (
                    "slug",
                    models.SlugField(
                        blank=True,
                        help_text="Leave blank to auto-generate from name.",
                        max_length=120,
                        unique=True,
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "verbose_name_plural": "cities",
                "ordering": ["name"],
            },
        ),
    ]
