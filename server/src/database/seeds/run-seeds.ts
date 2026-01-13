import "dotenv/config";
import "reflect-metadata";
import { AppDataSource } from "../../config/datasource";
import { seedAdmin } from "./admin.seed";

async function runSeeds() {
  try {
    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    console.log("🌱 Starting database seeds...\n");

    // Run seeds
    await seedAdmin();

    console.log("\n✅ All seeds completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  }
}

runSeeds();
