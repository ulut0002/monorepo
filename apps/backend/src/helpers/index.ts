import envConfig from "@/packages/shared/src/config/env.config";
import crypto from "crypto";
const random = () => {
  return crypto.randomBytes(128).toString("base64");
};

const authentication = (salt: string, password: string) => {
  const SECRET_KEY = envConfig.BACKEND_SECRET_KEY;

  if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined");
  }
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET_KEY)
    .digest("hex");
};

export { random, authentication };
