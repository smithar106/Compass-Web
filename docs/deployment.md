# Deployment

## Railway

The project includes a `railway.json` for Railway deployment.

1. Connect your GitHub repository to Railway
2. Railway will automatically detect the `railway.json` configuration
3. Set the environment variables in Railway dashboard:
   - `NEXT_PUBLIC_POSTHOG_KEY` (optional)
   - `NEXT_PUBLIC_POSTHOG_HOST` (optional)

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | No | PostHog project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | No | PostHog instance host URL |

## Manual Build

```bash
npm install
npm run build
npm start
```

The app runs on port 3000 by default.
