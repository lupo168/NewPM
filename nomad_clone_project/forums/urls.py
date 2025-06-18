from django.urls import path
from .views import (
    ForumCategoryListView,
    ThreadListView,
    thread_detail_view, # Changed to function view
    create_thread_view
    # create_post_view is now part of thread_detail_view for form display and POST handling
)

app_name = 'forums'
urlpatterns = [
    path('', ForumCategoryListView.as_view(), name='category_list'),
    path('category/<slug:category_slug>/', ThreadListView.as_view(), name='category_threads'),
    path('category/<slug:category_slug>/new-thread/', create_thread_view, name='create_thread'),
    path('thread/<int:thread_id>/', thread_detail_view, name='thread_detail'),
    # POST to thread_detail_view will handle new replies
]
