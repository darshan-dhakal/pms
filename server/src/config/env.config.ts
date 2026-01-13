import dotenv from "dotenv";

dotenv.config();

export const DotenvConfig = {
  PORT: Number(process.env.PORT ?? 4000),
  BASE_URL:
    process.env.BASE_URL ?? `http://localhost:${process.env.PORT ?? 4000}`,
  ACCESS_TOKEN_SECRET:
    process.env.ACCESS_TOKEN_SECRET ?? "change_me_access_secret",
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN ?? "24h",
  DB_HOST: process.env.DB_HOST ?? "localhost",
  DB_PORT: Number(process.env.DB_PORT ?? 5432),
  DB_USER: process.env.DB_USERNAME ?? "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD ?? "",
  DB_NAME: process.env.DB_NAME ?? "pms",
};
export default {};
