# China Finds - Community Platform

Welcome to China Finds, a community-driven platform for discovering unique products from China, built with React and Supabase.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Project Overview

China Finds aims to be a space where users can:
- Share and discover interesting products.
- Discuss finds and ask questions.
- Connect with other enthusiasts.
- (Future) Connect with manufacturers.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)

## Supabase Setup

This project uses [Supabase](https://supabase.io/) for its backend (authentication and database).

1.  **Create a Supabase Project:**
    *   Go to [Supabase Dashboard](https://supabase.com/dashboard) and create a new project.
    *   Save your **Project URL** and **anon key**. You will need these shortly.

2.  **Set up Database Schema:**
    *   In your Supabase project, navigate to the **SQL Editor**.
    *   Open the `database_schema/supabase_schema.sql` file from this repository.
    *   Copy and paste the SQL commands from this file into the Supabase SQL Editor and run them. This will create the necessary `users` and `posts` tables, along with Row Level Security (RLS) policies and a trigger to sync user profiles.

3.  **Configure Environment Variables:**
    *   In the root of the `china-finds-app` directory, create a file named `.env`.
    *   You can copy the contents of `.env.example` as a template:
        ```env
        REACT_APP_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
        REACT_APP_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
        ```
    *   Replace `YOUR_SUPABASE_PROJECT_URL` with your Supabase Project URL.
    *   Replace `YOUR_SUPABASE_ANON_PUBLIC_KEY` with your Supabase anon (public) key.

## Getting Started (Development)

To get a local copy up and running:

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <repository-url>
    cd china-finds-app
    ```

2.  **Install Dependencies:**
    Using npm:
    ```bash
    npm install
    ```
    Or using Yarn:
    ```bash
    yarn install
    ```

3.  **Run the Development Server:**
    Using npm:
    ```bash
    npm start
    ```
    Or using Yarn:
    ```bash
    yarn start
    ```
    This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload if you make edits.

## Available Scripts

In the project directory, you can run:

-   `npm start` or `yarn start`: Runs the app in development mode.
-   `npm test` or `yarn test`: Launches the test runner in interactive watch mode.
-   `npm run build` or `yarn build`: Builds the app for production to the `build` folder.
-   `npm run eject` or `yarn eject`: Removes the single dependency configuration (Create React App). **Note: this is a one-way operation.**

## Deployment

### Frontend (React App)

The React frontend is a static application after being built. You can deploy it to any static site hosting service. Popular choices include:

-   **[Vercel](https://vercel.com/)**: Offers seamless deployment for Next.js and Create React App projects. Connect your Git repository for automatic deployments.
-   **[Netlify](https://www.netlify.com/)**: Another excellent platform for deploying static sites. Also integrates well with Git.
-   **[GitHub Pages](https://pages.github.com/)**: Free hosting for public repositories.
-   **[AWS Amplify](https://aws.amazon.com/amplify/)**: Part of AWS, provides hosting for web applications.

**General Steps for Deployment (e.g., Vercel/Netlify):**
1.  Push your code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Sign up or log in to your chosen hosting provider (Vercel, Netlify).
3.  Connect your Git repository to the hosting provider.
4.  Configure the build settings:
    *   **Build command:** `npm run build` (or `yarn build`)
    *   **Publish directory:** `build`
5.  Set up your environment variables for Supabase on the hosting provider's platform:
    *   `REACT_APP_SUPABASE_URL`
    *   `REACT_APP_SUPABASE_ANON_KEY`
6.  Deploy the site.

### Backend (Supabase)

Supabase is a hosted backend-as-a-service platform. Your Supabase project (database, authentication, APIs) is already hosted by Supabase. You don't need to deploy it separately. Ensure your frontend application is configured with the correct Supabase URL and anon key to connect to your Supabase backend.

## Learn More

-   [React Documentation](https://reactjs.org/)
-   [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
-   [Supabase Documentation](https://supabase.io/docs)
-   [React Router Documentation](https://reactrouter.com/)
