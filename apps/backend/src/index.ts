import express from "express";
import cors from "cors";
import { User } from "@shared/types";
import * as http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import mongoose from "mongoose";
import router from "./router";
import { UserType } from "./types/types";
import envConfig from "./config/env.config";

declare global {
  namespace Express {
    interface Request {
      identity?: UserType;
    }
  }
}

const app = express();
app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

const PORT = process.env.BACKEND_PORT;
if (!PORT) {
  throw new Error("BACKEND_PORT is not defined in .env");
}

if (envConfig.BACKEND_MONGODB_URI) {
  mongoose.Promise = Promise;
  mongoose.connect(envConfig.BACKEND_MONGODB_URI);
  mongoose.connection.on("error", (err: Error) => {
    console.error(err);
  });
  mongoose.connection.on("connected", () => {
    console.info("MongoDB connected");
  });
}

server.listen(PORT, () => {
  console.info(`Backend running at http://localhost:${PORT}`);
});

app.get("/api/health", (_req, res) => {
  const user: User = {
    id: "1",
    name: "John",
    email: "john@example.com",
  };
  res.json({ status: "ok", user });
});

app.use("/", router());
