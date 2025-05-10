import crypto from "crypto";

const SECRET_KEY = process.env.BACKEND_SECRET_KEY;

const random = () => {
  return crypto.randomBytes(128).toString("base64");
};

const authentication = (salt: string, password: string) => {
  if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined");
  }
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET_KEY)
    .digest("hex");
};

export { random, authentication };
