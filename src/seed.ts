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

  const email = process.env.SUPERADMIN_EMAIL!;
  const plainPassword = process.env.SUPERADMIN_PASSWORD!;

  const password = await bcrypt.hash(plainPassword, 10);

  await prisma.admin.create({
    data: {
      name: "Super Admin",
      email: email,
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