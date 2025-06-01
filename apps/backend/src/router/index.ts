// src/routes/index.ts

// Import individual routers
import { authRouter } from "./authentication.router";
import { rootRouter } from "./root.router";

// Export all routers for centralized use in the main app (e.g., app.ts or server.ts)
//
// This allows clean importing like:
//    import { authRouter, rootRouter } from './routes';
// and registering like:
//    app.use('/auth', authRouter);
//    app.use('/', rootRouter);
export { authRouter, rootRouter };
