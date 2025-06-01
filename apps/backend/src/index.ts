import express from "express";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import * as http from "http";
import { envConfig } from "@shared/config/env.config";
import passport from "passport";
import { configureJwtStrategy } from "./controllers";
import { authRouter, rootRouter } from "./router";
import { ensureBody } from "./middleware";
import mongoose from "mongoose";

const PORT = envConfig.BACKEND_PORT;
if (!PORT || PORT === "") {
  throw new Error("BACKEND_PORT is not defined in the environment variables.");
}
configureJwtStrategy(passport);

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:4000",
    credentials: true,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(ensureBody);

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

const server = http.createServer(app);

server.listen(PORT, () => {
  console.info(`Backend running at http://localhost:${PORT}`);
});

app.use("/", rootRouter);
app.use("/auth", authRouter);
