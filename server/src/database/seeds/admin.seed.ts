import { AppDataSource } from "../../config/datasource";
import { User } from "../../entities/user.entity";
import { hashPassword } from "../../utils/bcrypt";
import { UserRole } from "../../constant/enums";

export async function seedAdmin() {
  const userRepository = AppDataSource.getRepository(User);

  try {
    // Check if admin already exists
    const adminExists = await userRepository.findOne({
      where: { email: process.env.ADMIN_EMAIL || "admin@example.com" },
    });

    if (adminExists) {
      console.log("✓ Admin user already exists");
      return;
    }

    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456";
    const adminFirstName = process.env.ADMIN_FIRST_NAME || "System";
    const adminLastName = process.env.ADMIN_LAST_NAME || "Administrator";

    const hashedPassword = await hashPassword(adminPassword);

    const admin = userRepository.create({
      firstName: adminFirstName,
      lastName: adminLastName,
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      isEmailVerified: true,
      isActive: true,
    });

    await userRepository.save(admin);

    console.log("✓ Admin user created successfully");
    console.log(`  Email: ${adminEmail}`);
    console.log(`  Role: ${UserRole.SUPER_ADMIN}`);
  } catch (error) {
    console.error("✗ Error seeding admin:", error);
    throw error;
  }
}
