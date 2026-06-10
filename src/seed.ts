import { PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const exists = await prisma.admin.findFirst({
    where: {
      role: Role.SUPER_ADMIN,
    },
  });

  if (exists) {
    console.log("Super Admin already exists");
    return;
  }

  const password = await bcrypt.hash(
    "SuperAdmin@123",
    10
  );

  await prisma.admin.create({
    data: {
      name: "Super Admin",
      email: "superadmin@fleetwise.com",
      password,
      role: Role.SUPER_ADMIN,
    },
  });

  console.log("✅ Super Admin Created");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });