import { DataSource } from "typeorm";
import path from "path";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "pms_db",
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV === "development",
  entities: [
    path.join(__dirname, "src/entities/**/*.entity.ts"),
    path.join(__dirname, "src/entities/**/*.entity.js"),
  ],
  migrations: [
    path.join(__dirname, "src/database/migrations/**/*.ts"),
    path.join(__dirname, "src/database/migrations/**/*.js"),
  ],
  subscribers: [
    path.join(__dirname, "src/subscribers/**/*.ts"),
    path.join(__dirname, "src/subscribers/**/*.js"),
  ],
});
