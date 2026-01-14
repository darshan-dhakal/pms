import "dotenv/config";
import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { AppDataSource } from "./config/datasource";
import { authRoutes } from "./routes/auth.route";
import { userRoutes } from "./routes/user.route";
import { projectRoutes } from "./routes/project.route";
import { taskRoutes } from "./routes/task.route";
import { teamRoutes } from "./routes/team.route";
import { teamMemberRoutes } from "./routes/team-member.route";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("combined"));

// Routes setup
app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/team-members", teamMemberRoutes);

// Initialize TypeORM and start the server
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err.message);
    process.exit(1);
  });
