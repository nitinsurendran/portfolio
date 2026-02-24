## Deploying to Vercel (Git workflow)

Follow these steps to get a `*.vercel.app` production URL using the Vercel UI.

### 1. Initialize Git and push to GitHub (run in your terminal)

From the project root (`Portfolio 2026/portfolio`):

```bash
cd "/Users/nitin.surendran/Portfolio 2026/portfolio"

# Initialize Git (if not already a repo)
git init

# Create initial commit (adjust remote URL to your GitHub repo)
git add .
git commit -m "Initial commit for portfolio"

# Add GitHub remote (replace with your username/repo)
git remote add origin git@github.com:YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2. Connect the GitHub repo in Vercel

In the Vercel dashboard:

1. Click **"New Project"**.
2. Under **"Import Git Repository"**, choose **GitHub** and authorize if prompted.
3. Select your portfolio repository (the one you just pushed) and click **"Import"**.

### 3. Configure project settings (use Vercel defaults)

On the project configuration screen:

- **Framework Preset**: Vercel should auto-detect **Next.js**. Leave it as-is.
- **Root Directory**: Keep the default (the repository root) — this project is **not** a monorepo.
- **Build Command**: Use the default `next build` (leave the field unchanged).
- **Output Directory**: Use the default `.next` (Vercel handles this automatically for Next.js).
- **Environment Variables**: None are required for this project; leave this empty unless you add features that need them later.

Then click **"Deploy"**.

### 4. Finding your production URL

After the first deploy finishes:

1. Vercel will show a success screen with your production URL in the form `https://your-project-name.vercel.app`.
2. You can always find it later by:
   - Opening the project in Vercel.
   - Looking at the **"Production Deployment"** in the **Deployments** tab.
   - The URL shown there (ending in `.vercel.app`) is your live production URL.

