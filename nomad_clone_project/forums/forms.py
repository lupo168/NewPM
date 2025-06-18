from django import forms
from .models import Thread, Post

class ThreadForm(forms.ModelForm):
    class Meta:
        model = Thread
        fields = ['title', 'initial_content']
        labels = {
            'initial_content': 'Your first post content'
        }

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['content']
        widgets = {
            'content': forms.Textarea(attrs={'rows': 5}),
        }
        labels = {
            'content': 'Your Reply',
        }
