# Setup Supabase (Free Database)

This project uses [Supabase](https://supabase.com/) for its database and authentication. Supabase offers a generous free tier that is perfect for this application.

## 1. Create a Supabase Account
1.  Go to [supabase.com](https://supabase.com/).
2.  Click "Start your project" and sign in with GitHub.

## 2. Create a New Project
1.  Click "New Project".
2.  Choose your organization (if any).
3.  **Name**: `gym-connect-ai` (or any name you like).
4.  **Database Password**: Generate a strong password and **save it** (you might need it later for direct access, though not for the app itself).
5.  **Region**: Choose a region close to you (e.g., specific Europe or US region).
6.  Click "Create new project".
7.  Wait a few minutes for the database to be provisioned.

## 3. Get Your API Keys
Once the project is ready:
1.  Go to **Project Settings** (cog icon at the bottom left).
2.  Click on **API**.
3.  Look for the `Project URL` and `anon` `public` key.
4.  You will need these for your environment variables.

## 4. Run Database Migrations
You need to set up the tables (Users, Bookings, etc.). You can do this via the Supabase SQL Editor.

1.  In your Supabase dashboard, click on the **SQL Editor** icon (left sidebar).
2.  Click "New Query".
3.  Copy the content from the **newly created file** `supabase/full_schema.sql` in this project (I just created it for you).
    -   This file contains complete database setup code.
4.  Paste the SQL into the Supabase SQL Editor and click **Run**.

## 5. Connect Your App
Updated the environment variables in your deployment platform (Vercel, Netlify) or local `.env` file:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

*Note: The app code expects `SUPABASE_URL` and `SUPABASE_ANON_KEY` but Vite requires them to start with `VITE_` to be exposed to the browser, or you need to explicitly configured them. The updated code in `src/utils/env.ts` handles `VITE_` prefix automatically.*
