# Deployment Guide

This guide will help you deploy **Gym Connect AI** for free using GitHub, Supabase, and Vercel (or Netlify).

## Prerequisites
-   A [GitHub](https://github.com/) account.
-   A [Supabase](https://supabase.com/) account (see `SETUP_SUPABASE.md`).
-   A [Vercel](https://vercel.com/) account (recommended for React/Vite apps).

## Step 1: Push to GitHub
1.  Create a new repository on GitHub (e.g., `gym-connect-ai`).
2.  Push your local code to this repository.
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/gym-connect-ai.git
    git branch -M main
    git push -u origin main
    ```

## Step 2: Configure Supabase
Follow the instructions in `SETUP_SUPABASE.md` to:
1.  Create a project.
2.  Run the database migrations (SQL).
3.  Get your **URL** and **ANON KEY**.

## Step 3: Deploy to Vercel
1.  Log in to [Vercel](https://vercel.com/).
2.  Click "Add New..." -> "Project".
3.  Import your `gym-connect-ai` GitHub repository.
4.  **Configure Project**:
    -   Framework Preset: **Vite** (should be auto-detected).
    -   Root Directory: `./` (default).
5.  **Environment Variables**:
    -   Expand the "Environment Variables" section.
    -   Add:
        -   `VITE_SUPABASE_URL`: Your Supabase Project URL.
        -   `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
6.  Click **Deploy**.

## Step 4: Finalize
Once deployed, Vercel will give you a live URL (e.g., `https://gym-connect-ai.vercel.app`).
1.  Go back to your **Supabase Dashboard**.
2.  Go to **Authentication** -> **URL Configuration**.
3.  Add your Vercel URL to the **Site URL** and **Redirect URLs** to ensure login redirects work correctly.

## Troubleshooting

### ⚠️ Error: "Deploying from a private GitHub organization requires a Vercel Pro plan"
This happens if you created the repository under a **GitHub Organization** instead of your **Personal Account**, or if you are trying to deploy a Private repository from an Organization on the Free plan.

**Solution 1: Use Your Personal Account (Recommended)**
1.  Go to **[GitHub.com/new](https://github.com/new)**.
2.  **Crucial**: In the "Owner" dropdown, make sure it says **your username** (e.g., `massimilianosabato`), NOT an organization.
3.  Name it `gym-connect-ai` (or similar) and create it.
4.  **In your terminal** (inside this project folder), run these commands to "switch" destination:

    ```bash
    # 1. Remove the old link to the organization repo
    git remote remove origin

    # 2. Add the link to your new PERSONAL repo
    git remote add origin https://github.com/GitMax76/gym-connect-ai.git

    # 3. Push the code to the new location
    git push -u origin main
    ```

5.  Now go to Vercel, click "Add New Project", and import this **new** repository. It will be free!

**Solution 2: Make the Repository Public**
If you must use an Organization:
1.  Go to your GitHub Repository > Settings.
2.  Scroll to the bottom "Danger Zone".
3.  Click "Change visibility" -> **Change to public**.
4.  Vercel allows public organization repositories on the free plan (usually).

### ⚠️ App crashes / White Screen on Load
Check your **Environment Variables** in Vercel.
1. Are `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set?
2. Did you copy the values correctly from Supabase?
3. Did you redeploy after adding them? (Go to Deployments > Redeploy).

