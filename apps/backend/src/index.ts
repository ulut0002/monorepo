import express from "express";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import * as http from "http";
import passport from "passport";
import { configureJwtStrategy } from "./controllers";
import { authRouter, rootRouter } from "./router";
import { ensureBody } from "./middleware";
import mongoose from "mongoose";
import { getBackendUrl, loadEnvConfig } from "@monorepo/shared";

// Load environment variables from .env files and generate usable config values
const config = loadEnvConfig();
const backendUrl = getBackendUrl();

console.log("Starting backend app...");
console.log("PORT from env:", process.env.PORT);

// Extract and validate required port
const PORT = Number(config.BACKEND_PORT || process.env.PORT || 3000);
if (!PORT) {
  throw new Error("BACKEND_PORT is not defined in the environment variables.");
} else {
  console.info(`Using port ${PORT} for backend`);
}

// Configure JWT strategy for passport (reads JWT from cookies)
configureJwtStrategy(passport);

const app = express();

// Enable JSON body parsing for incoming requests
app.use(express.json());

// Enable CORS for cross-origin requests (e.g., from Next.js frontend)
app.use(
  cors({
    origin: backendUrl, // expected frontend origin
    credentials: true, // allows cookies to be sent with requests
  })
);

// Use compression to gzip HTTP responses for better performance
app.use(compression());

// Parse cookies from incoming requests
app.use(cookieParser());

// Parse JSON bodies (redundant with express.json, but kept for safety)
app.use(bodyParser.json());

// Initialize Passport middleware (needed before protected routes)
app.use(passport.initialize());

// Ensure `req.body` is always defined (avoids null reference errors)
app.use(ensureBody);

// Setup MongoDB connection
if (config.BACKEND_MONGODB_URI) {
  mongoose.Promise = Promise;
  mongoose.connect(config.BACKEND_MONGODB_URI);

  mongoose.connection.on("error", (err: Error) => {
    console.error("MongoDB connection error:", err);
  });

  mongoose.connection.on("connected", () => {
    console.info("MongoDB connected");
  });
}

// Start the HTTP server
const server = http.createServer(app);

server.listen(PORT, "0.0.0.0", () => {
  console.info(`Backend running at http://0.0.0.0:${PORT}`);
});

// Define API routes
app.use("/", rootRouter); // e.g., GET / → API info
app.use("/auth", authRouter); // e.g., POST /auth/login, /auth/register
