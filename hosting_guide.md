# Hosting Guide for ZERO OS Monorepo

Hosting a monorepo with a Next.js frontend (`apps/web`) and a Node.js/Express backend (`apps/api`) requires a platform that can either handle both easily or splitting them across optimized services.

Here are the recommended ways to host this project:

---

## Option 1: Vercel (Frontend) + Render / Railway (Backend) - *Recommended*
This is the most common and robust approach for Next.js + Express stacks. Vercel is built by the creators of Next.js and offers the best performance for the frontend, while platforms like Render or Railway are perfect for running background Node.js processes.

### 1. Frontend: Vercel (`apps/web`)
1. Create a [Vercel](https://vercel.com/) account and connect your GitHub repository.
2. When importing the project, set the **Root Directory** to `apps/web`.
3. Vercel will automatically detect that it's a Next.js project.
4. Add all the necessary environment variables from your `apps/web/.env`.
5. Deploy.

### 2. Backend API: Render or Railway (`apps/api`)
1. Create a [Render](https://render.com/) or [Railway](https://railway.app/) account and connect your GitHub repository.
2. Create a **Web Service**.
3. Set the **Root Directory** to `apps/api`.
4. Build Command: `npm install && npm run build`
5. Start Command: `npm start`
6. Add the environment variables from your `apps/api/.env` (Make sure to include your MongoDB URI and any API keys like Resend/Cloudinary).
7. Deploy.
8. **Crucial Step:** Once the backend is deployed, copy its URL and update the `NEXT_PUBLIC_API_URL` (or equivalent) in your Vercel frontend environment variables so the frontend knows where to talk to the backend.

---

## Option 2: All-in-One on AWS / DigitalOcean / Vultr (VPS)
If you want full control over your infrastructure and want to host both under the same server using Docker or PM2, a Virtual Private Server (VPS) is the way to go.

### Steps using PM2 & NGINX
1. Spin up a Linux server (e.g., Ubuntu on DigitalOcean).
2. SSH into the server, install **Node.js**, **Git**, **PM2**, and **Nginx**.
3. Clone your repository.
4. Run `npm install` at the root to install all dependencies for both workspaces.
5. Run `npm run build` at the root.
6. Use **PM2** to keep both apps running forever:
   - `pm2 start npm --name "zero-web" -- run start --workspace @zero/web`
   - `pm2 start npm --name "zero-api" -- run start --workspace @zero/api`
7. Configure **Nginx** as a reverse proxy:
   - Route `yourdomain.com` to your Next.js app (usually running on port 3000).
   - Route `api.yourdomain.com` to your Express API.
8. Secure the server with SSL using Certbot.

---

## Option 3: Containerized Deployment (Docker + Fly.io / AWS ECS)
If your goal is high scalability, you can containerize both applications.

1. Write a `Dockerfile` for `apps/web` and another `Dockerfile` for `apps/api`.
2. Ensure you build them using monorepo-friendly commands (e.g., using `npm workspaces` inside the Docker image).
3. Push the images to a container registry (like Docker Hub or GitHub Container Registry).
4. Deploy the frontend to a managed container service (like AWS App Runner or Fly.io).
5. Deploy the backend to a similar service.

### Summary
* Choose **Option 1 (Vercel + Render/Railway)** if you want the easiest, fastest setup with the best developer experience.
* Choose **Option 2 (DigitalOcean Dropet)** if you want everything in one place and have server management experience.
