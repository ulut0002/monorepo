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
import { getBackendUrl, loadEnvConfig } from "@shared/config/env.utils";

// Load environment variables from .env files and generate usable config values
const config = loadEnvConfig();
const backendUrl = getBackendUrl();

// Extract and validate required port
const PORT = config.BACKEND_PORT;
if (!PORT || PORT === "") {
  throw new Error("BACKEND_PORT is not defined in the environment variables.");
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

server.listen(PORT, () => {
  console.info(`Backend running at ${backendUrl}`);
});

// Define API routes
app.use("/", rootRouter); // e.g., GET / → API info
app.use("/auth", authRouter); // e.g., POST /auth/login, /auth/register
