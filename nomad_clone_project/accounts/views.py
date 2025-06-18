from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm
from .forms import UserRegisterForm
from django.contrib.auth.decorators import login_required
# from .models import UserProfile # UserProfile is accessed via user.profile

# Registration view
def register(request):
    if request.user.is_authenticated: # Redirect if already logged in
        return redirect('/')
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            # UserProfile is created automatically by the signal
            login(request, user)
            messages.success(request, f'Account created for {user.username}! You are now logged in.')
            return redirect('/')
    else:
        form = UserRegisterForm()
    return render(request, 'accounts/register.html', {'form': form, 'title': 'Register'})

# Login view
def login_view(request):
    if request.user.is_authenticated: # Redirect if already logged in
        return redirect('/')
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                next_page = request.GET.get('next')
                if next_page:
                    return redirect(next_page)
                return redirect('/')
            else:
                messages.error(request, 'Invalid username or password.')
        else:
            messages.error(request, 'Invalid username or password.')
    else:
        form = AuthenticationForm()
    return render(request, 'accounts/login.html', {'form': form, 'title': 'Login'})

# Logout view
def logout_view(request):
    logout(request)
    messages.info(request, 'You have successfully logged out.')
    return redirect('/')

# Basic Profile View
@login_required
def profile_view(request):
    # UserProfile is accessible via request.user.profile due to related_name='profile'
    return render(request, 'accounts/profile.html', {'title': 'My Profile'})
