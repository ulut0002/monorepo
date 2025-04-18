# Monorepo

This repo demonstrates a clean monorepo architecture using **pnpm workspaces** and **Turborepo**, integrating a **Next.js** frontend and an **Express.js** backend, with **shared TypeScript types and utilities**.

Ideal for full-stack apps that need unified type safety, efficient code sharing, and a scalable folder structure.

---

## Getting Started

### 1. Clone the repository

```
git clone git@github.com:ulut0002/monorepo.git .

```

### 2. Install dependencies

Make sure you have pnpm installed globally:

```
npm install -g pnpm
```

Then install everything:

```
pnpm -r install
```

### 3. Running the Apps

Start the backend (Express.js) from the root project directory

```
pnpm run dev:backend
```

Backend will run at: [http://localhost:4000/api/health](http://localhost:4000/api/health "http://localhost:4000/api/health")

Start the frontend (Next.js) from the root project directory

```
pnpm run dev:frontend
```

Frontend will run at: [ http://localhost:3000](http://localhost:3000http:// " http://localhost:3000")
It will fetch user data from the backend and display it using a shared User type from the shared package.

## Tech Stack

- Next.js
- Express.js
- TypeScript
- Turborepo
- pnpm
- Tailwind CSS

## Shared Code

Use the `@shared` import alias to access shared types/utilities:

```
import { User } from "@shared/types";
```

This alias is configured in the root tsconfig.json and respected by both frontend and backend apps.

## Notes

- This setup is designed to be minimal and beginner-friendly.
- You can extend it with additional packages like Jest, Prisma, Zod, etc.
- Consider using Docker or environment-based .env configs for production-ready deployments.

## Medium Post

A step-by-step blog post is available on [Medium](https://medium.com/@serdar.ulutas/a-simple-monorepo-setup-with-next-js-and-express-js-4bbe0e99b259)
