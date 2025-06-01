import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import dotenv from "dotenv";
import path from "path";

const env = process.env.NODE_ENV || "development";
const envPaths = [
  `../../.env.${env}.local`,
  `../../.env.${env}`,
  `../../.env.local`,
  `../../.env`,
];

// Load first one that exists
for (const envPath of envPaths) {
  const fullPath = path.resolve(__dirname, envPath);
  const result = dotenv.config({ path: fullPath });
  if (!result.error) break;
}

const nextConfig: NextConfig = {
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
    BACKEND_PORT: process.env.BACKEND_PORT,
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
