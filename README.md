This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Google Analytics 4

The app uses GA4 via gtag.js when a measurement ID is provided.

- **Enable GA:** In [Vercel](https://vercel.com) go to your project → **Settings** → **Environment Variables**. Add `NEXT_PUBLIC_GA_ID` with your GA4 measurement ID (e.g. `G-XXXXXXXXXX`). Redeploy so the variable is inlined at build time.
- **Behaviour:** GA scripts load only in production unless `NEXT_PUBLIC_GA_DEBUG=true` is set. If `NEXT_PUBLIC_GA_ID` is missing, no GA scripts are injected. Page views are sent on initial load and on client-side route changes.
- **Verify:** In [Google Analytics](https://analytics.google.com), open **Reports** → **Realtime** and navigate the site; you should see active users and page views.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
