from django.contrib import admin
from .models import ForumCategory, Thread, Post

@admin.register(ForumCategory)
class ForumCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}

class PostInline(admin.StackedInline):
    model = Post
    extra = 1
    readonly_fields = ('author', 'created_at', 'updated_at')
    # For new posts via inline, author should be set if possible, or it's an issue.
    # Usually, inlines are for viewing related objects or simple additions.
    # Complex scenarios might need custom handling or separate Post creation.

@admin.register(Thread)
class ThreadAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'author', 'created_at', 'updated_at')
    list_filter = ('category', 'author', 'created_at')
    search_fields = ('title', 'author__username', 'initial_content')
    inlines = [PostInline]
    # Consider making initial_content readonly if posts are used for all content.
    # Or, remove PostInline if first post isn't created via admin thread creation.

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'thread', 'author', 'created_at')
    list_filter = ('author', 'created_at')
    search_fields = ('content', 'author__username', 'thread__title')
