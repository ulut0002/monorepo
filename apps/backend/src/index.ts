import express from "express";
import cors from "cors";
import { User } from "@shared/types";
import * as http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

import router from "./router";
const env = process.env.NODE_ENV || "development";
const envPath = path.resolve(__dirname, `../../../.env.${env}`);
dotenv.config({ path: envPath });

// fallback
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

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

const MONGODB_URI = process.env.BACKEND_MONGODB_URI || "";

if (MONGODB_URI) {
  mongoose.Promise = Promise;
  mongoose.connect(MONGODB_URI);
  mongoose.connection.on("error", (err: Error) => {
    console.log(err);
  });
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });
}

server.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
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
