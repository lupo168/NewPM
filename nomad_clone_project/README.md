# Nomad Clone - Django Community Platform

This project is a Django-based community platform inspired by sites like Nomad List. It features user registration, city information, and forums.

## Project Structure Overview

- `config/`: Contains the main Django project configuration (settings.py, urls.py, wsgi.py).
- `pages/`: Django app for basic static pages like the homepage.
- `accounts/`: Django app for user authentication (registration, login, logout) and user profiles.
- `cities/`: Django app for managing and displaying city information.
- `forums/`: Django app for the community forum (categories, threads, posts).
- `templates/`: Contains HTML templates for all apps, organized by app name.
- `static/`: Contains static files (CSS, JavaScript, images).
- `media/`: Directory where user-uploaded files (like avatars, city images) will be stored during development.
- `manage.py`: Django's command-line utility.
- `venv/`: Python virtual environment (should be in .gitignore).

## Prerequisites

- Python 3.8+
- Pip (Python package installer)
- Virtualenv (recommended for isolating project dependencies)

## Setup and Installation

1.  **Clone the repository (if applicable):**
    ```bash
    git clone <your-repository-url>
    cd nomad_clone_project
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    # On Windows: venv\Scripts\activate
    ```

3.  **Install dependencies:**
    The primary dependency is Django. Pillow is required for ImageFields.
    ```bash
    pip install django==4.2 pillow
    # Or, if a requirements.txt file is provided in the future:
    # pip install -r requirements.txt
    ```

4.  **Apply database migrations:**
    This will create the necessary database tables for Django's built-in apps and our custom apps (accounts, cities, forums).
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

5.  **Create a superuser account:**
    This account will have access to the Django admin interface, where you can manage users, cities, forum categories, etc.
    ```bash
    python manage.py createsuperuser
    ```
    Follow the prompts to set a username, email, and password.

## Running the Development Server

1.  **Start the server:**
    ```bash
    python manage.py runserver
    ```

2.  Open your web browser and navigate to [http://127.0.0.1:8000/](http://127.0.0.1:8000/).
    - Homepage: `/`
    - Cities: `/cities/`
    - Forums: `/forums/`
    - Register: `/accounts/register/`
    - Login: `/accounts/login/`
    - Admin: `/admin/` (log in with your superuser credentials)

## Using the Django Admin

The Django admin panel is a powerful tool for managing the site's content. Access it by navigating to `/admin/` and logging in with your superuser account.

From the admin panel, you can:
- Manage Users and User Profiles.
- Add, edit, and delete Cities.
- Create and manage Forum Categories.
- View and manage Threads and Posts (though typically users create these from the frontend).

## Basic Deployment Guidance

Deploying a Django application involves several components. Here's a general outline:

1.  **Choose a Hosting Platform:**
    *   **PaaS (Platform as a Service):** Heroku, PythonAnywhere, Google App Engine, AWS Elastic Beanstalk. These platforms often simplify deployment.
    *   **VPS (Virtual Private Server):** DigitalOcean, Linode, AWS EC2. Gives you more control but requires more setup.

2.  **Database:**
    *   For production, use a robust database like PostgreSQL or MySQL instead of SQLite. Most PaaS providers offer managed database services.

3.  **WSGI Server:**
    *   Django's development server (`runserver`) is NOT suitable for production.
    *   Use a WSGI server like Gunicorn or uWSGI to run your Django application.
    *   Example with Gunicorn: `gunicorn config.wsgi:application`

4.  **Static Files:**
    *   Run `python manage.py collectstatic` to gather all static files into a single directory (`STATIC_ROOT` in `settings.py`).
    *   Configure a web server (like Nginx or Apache) or a CDN (Content Delivery Network) to serve these static files efficiently.

5.  **Media Files:**
    *   User-uploaded files (`MEDIA_ROOT`) also need to be handled. In production, these are often stored in a cloud storage service like AWS S3, Google Cloud Storage, or Azure Blob Storage.

6.  **Web Server (Reverse Proxy):**
    *   A web server like Nginx or Apache is typically used in front of your WSGI server. It can:
        *   Serve static files.
        *   Handle HTTPS (SSL/TLS termination).
        *   Act as a reverse proxy, forwarding requests to your WSGI server (Gunicorn).
        *   Provide load balancing if you have multiple application servers.

7.  **Environment Variables:**
    *   **NEVER hardcode sensitive information** like `SECRET_KEY`, database passwords, or API keys in your code.
    *   Use environment variables to configure these in production. Django settings should read these variables.
    *   Set `DEBUG = False` in production.
    *   Configure `ALLOWED_HOSTS` in `settings.py` to include your domain name(s).

8.  **Security:**
    *   Keep Django and all dependencies updated.
    *   Follow Django's security best practices (e.g., CSRF protection, XSS protection, HTTPS).
    *   Review Django's deployment checklist: [https://docs.djangoproject.com/en/stable/howto/deployment/checklist/](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)

**Example for a simple PaaS (e.g., Heroku):**
- Add Gunicorn to your `requirements.txt`.
- Create a `Procfile` (e.g., `web: gunicorn config.wsgi --log-file -`).
- Configure Heroku to use a PostgreSQL database.
- Set environment variables on Heroku (SECRET_KEY, DATABASE_URL, etc.).
- Push your code to Heroku.

This is a high-level overview. Each platform and setup will have its own specific instructions.
