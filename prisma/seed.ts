import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const BCRYPT_ROUNDS = 12;

async function main() {
  console.log("Starting seeding...");

  await prisma.user.deleteMany();

  const users: {
    name: string;
    email: string;
    is_verified: true;
    password: string;
    role: Role;
  }[] = [
    {
      name: "Admin User",
      email: "admin@tirai.id",
      is_verified: true,
      password: await hash("adminpassword", BCRYPT_ROUNDS),
      role: "ADMIN",
    },
    {
      name: "Super Admin",
      email: "superadmin@tirai.id",
      is_verified: true,
      password: await hash("superadminpassword", BCRYPT_ROUNDS),
      role: "SUPERADMIN",
    },
    {
      name: "Sales User",
      email: "sales@tirai.id",
      is_verified: true,
      password: await hash("salespassword", BCRYPT_ROUNDS),
      role: "SALES",
    },
    {
      name: "Content Writer",
      email: "contentwriter@tirai.id",
      is_verified: true,
      password: await hash("contentwriterpassword", BCRYPT_ROUNDS),
      role: "CONTENTWRITER",
    },
  ];

  await prisma.user.createMany({ data: users });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
