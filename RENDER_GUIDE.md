# Deployment Guide for Render

## 1. Prerequisites
- Create a [Render](https://render.com) account.
- Push this code to a GitHub repository.

## 2. Deployment Steps (Using Blueprint)
1. Go to the Render Dashboard and click **New +** -> **Blueprint**.
2. Connect your GitHub repository.
3. Render will automatically detect the `render.yaml` file.
4. It will ask for Environment Variables. Fill them in:

### Backend Service (`cinebook-backend`)
- `DB_URL`: Your MongoDB connection string.
- `REDIS_URL`: Your Redis URL.
- `REDIS_PASSWORD`: Your Redis password.
- `STRIPE_SECRET_KEY`: Your Stripe Secret Key.
- `JWT_SECRET`: A secret string for authentication.
- `FRONTEND_URL`: **IMPORTANT** - Leave this blank initially or put a placeholder. You will update this *after* the frontend is deployed.

### Frontend Service (`cinebook-frontend`)
- `VITE_API_BASE_URL`: **IMPORTANT** - Look at the URL Render assigns to your **Backend Service** (e.g., `https://cinebook-backend.onrender.com`). Enter that URL here.

## 3. Post-Deployment Configuration (Connecting them)
Since the Frontend needs the Backend URL, and the Backend needs the Frontend URL, you might need to do a quick update after the first deploy:

1. **Get the Frontend URL**: Once the frontend is live (e.g., `https://cinebook-frontend.onrender.com`), copy it.
2. **Update Backend**: Go to your **Backend Service** dashboard > **Environment**.
3. Add/Update `FRONTEND_URL` with the copied value (no trailing slash, e.g., `https://cinebook-frontend.onrender.com`).
4. **Save Changes**: This will trigger a quick redeploy of the backend.

## 4. Troubleshooting Images & Stripe
- If images break in Stripe Checkout, ensure `FRONTEND_URL` is set correctly in the Backend.
- Images are served by the Frontend Static Site, so the Backend simply redirects Stripe to those URLs.
