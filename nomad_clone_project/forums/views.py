from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from django.views.generic import ListView # Removed DetailView, CreateView as using function views for more control
from django.contrib.auth.decorators import login_required
from .models import ForumCategory, Thread, Post
from .forms import ThreadForm, PostForm
from django.utils import timezone

class ForumCategoryListView(ListView):
    model = ForumCategory
    template_name = 'forums/category_list.html'
    context_object_name = 'categories'

class ThreadListView(ListView):
    model = Thread
    template_name = 'forums/thread_list.html'
    context_object_name = 'threads'
    paginate_by = 15

    def get_queryset(self):
        self.category = get_object_or_404(ForumCategory, slug=self.kwargs['category_slug'])
        return Thread.objects.filter(category=self.category).order_by('-updated_at')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['category'] = self.category
        return context

@login_required
def create_thread_view(request, category_slug):
    category = get_object_or_404(ForumCategory, slug=category_slug)
    if request.method == 'POST':
        form = ThreadForm(request.POST)
        if form.is_valid():
            thread = form.save(commit=False)
            thread.author = request.user
            thread.category = category
            thread.updated_at = timezone.now() # Explicitly set updated_at on creation
            thread.save() # This will also set created_at
            # The initial_content is part of the Thread model, so no separate Post needed here
            return redirect(thread.get_absolute_url())
    else:
        form = ThreadForm()
    return render(request, 'forums/create_thread.html', {'form': form, 'category': category, 'title': 'Start New Thread'})

def thread_detail_view(request, thread_id): # Changed to function view
    thread = get_object_or_404(Thread, pk=thread_id)
    posts = thread.posts.all().order_by('created_at')

    if request.method == 'POST':
        if not request.user.is_authenticated:
            return redirect(reverse('accounts:login') + '?next=' + request.path) # Redirect to login

        post_form = PostForm(request.POST)
        if post_form.is_valid():
            post = post_form.save(commit=False)
            post.author = request.user
            post.thread = thread
            post.save() # This will trigger the signal to update thread.updated_at
            return redirect(thread.get_absolute_url() + f'#post-{post.id}')
    else:
        post_form = PostForm()

    return render(request, 'forums/thread_detail.html', {
        'thread': thread,
        'posts': posts,
        'post_form': post_form,
        'title': thread.title
    })

# create_post_view is now integrated into thread_detail_view
