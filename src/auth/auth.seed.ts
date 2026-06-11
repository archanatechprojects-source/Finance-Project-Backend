import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { Role } from "@prisma/client";

export async function seedSuperAdmin(
  prisma: PrismaService
) {
  const exists =
    await prisma.admin.findFirst({
      where: {
        role: Role.SUPER_ADMIN,
      },
    });

  if (exists) return;

  const password =
    await bcrypt.hash(
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

  console.log(
    "Super Admin Created successfully"
  );
}