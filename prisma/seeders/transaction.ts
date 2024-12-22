import { PrismaClient, Role, OrderStatus } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();
const BCRYPT_ROUNDS = 12;

async function main() {
  console.log("Starting seeding for curtain marketplace...");

  // Users
  const users = [
    {
      name: "John Customer",
      email: "john.customer@example.com",
      is_verified: true,
      password: await hash("password123", BCRYPT_ROUNDS),
      role: Role.CUSTOMER,
    },
    {
      name: "Alice Admin",
      email: "alice.admin@example.com",
      is_verified: true,
      password: await hash("adminpassword", BCRYPT_ROUNDS),
      role: Role.ADMIN,
    },
    {
      name: "Bob Supplier",
      email: "bob.supplier@example.com",
      is_verified: true,
      password: await hash("supplierpassword", BCRYPT_ROUNDS),
      role: Role.SUPPLIER,
    },
    {
      name: "Clara Writer",
      email: "clara.writer@example.com",
      is_verified: true,
      password: await hash("writerpassword", BCRYPT_ROUNDS),
      role: Role.CONTENTWRITER,
    },
    {
      name: "Eva Sales",
      email: "eva.sales@example.com",
      is_verified: true,
      password: await hash("salespassword", BCRYPT_ROUNDS),
      role: Role.SALES,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  // Categories
  const categories = [
    { name: "Tirai Blackout", slug: "tirai-blackout" },
    { name: "Tirai Sheer", slug: "tirai-sheer" },
    { name: "Gorden Dekoratif", slug: "gorden-dekoratif" },
    { name: "Aksesoris Tirai", slug: "aksesoris-tirai" },
    { name: "Rel dan Gantungan", slug: "rel-dan-gantungan" },
  ];

  for (const category of categories) {
    await prisma.productCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        ...category,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  // Products
  const products = [
    {
      name: "Tirai Blackout Premium",
      description:
        "Tirai blackout dengan bahan premium untuk privasi dan kenyamanan.",
      photos: ["blackout_premium.jpg"],
      price: 500000,
      stock: 100,
      weight: 2.5,
      slug: "tirai-blackout-premium",
      is_published: true,
      category_id: await prisma.productCategory
        .findFirst({
          where: { slug: "tirai-blackout" },
        })
        .then((cat) => cat?.id || ""),
    },
    {
      name: "Tirai Sheer Transparan",
      description:
        "Tirai sheer yang ringan dan transparan untuk dekorasi minimalis.",
      photos: ["sheer_transparan.jpg"],
      price: 250000,
      stock: 150,
      weight: 1.2,
      slug: "tirai-sheer-transparan",
      is_published: true,
      category_id: await prisma.productCategory
        .findFirst({
          where: { slug: "tirai-sheer" },
        })
        .then((cat) => cat?.id || ""),
    },
    {
      name: "Gorden Dekoratif Motif Bunga",
      description:
        "Gorden dengan motif bunga untuk memperindah ruang tamu Anda.",
      photos: ["gorden_bunga.jpg"],
      price: 350000,
      stock: 75,
      weight: 3.0,
      slug: "gorden-dekoratif-motif-bunga",
      is_published: true,
      category_id: await prisma.productCategory
        .findFirst({
          where: { slug: "gorden-dekoratif" },
        })
        .then((cat) => cat?.id || ""),
    },
    {
      name: "Rel Gorden Aluminium",
      description: "Rel gorden berbahan aluminium, kuat dan tahan lama.",
      photos: ["rel_aluminium.jpg"],
      price: 150000,
      stock: 200,
      weight: 1.5,
      slug: "rel-gorden-aluminium",
      is_published: true,
      category_id: await prisma.productCategory
        .findFirst({
          where: { slug: "rel-dan-gantungan" },
        })
        .then((cat) => cat?.id || ""),
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  // Orders
  const orders = [
    {
      total_price: 850000,
      phone_number: "081234567890",
      status: OrderStatus.FINISHED,
      user_id: await prisma.user
        .findFirst({
          where: { email: "john.customer@example.com" },
        })
        .then((user) => user?.id || ""),
    },
    {
      total_price: 350000,
      phone_number: "081234567891",
      status: OrderStatus.PACKING,
      user_id: await prisma.user
        .findFirst({
          where: { email: "john.customer@example.com" },
        })
        .then((user) => user?.id || ""),
    },
    {
      total_price: 500000,
      phone_number: "081234567892",
      status: OrderStatus.SHIPPING,
      user_id: await prisma.user
        .findFirst({
          where: { email: "john.customer@example.com" },
        })
        .then((user) => user?.id || ""),
    },
  ];

  for (const order of orders) {
    await prisma.order.create({
      data: {
        ...order,
        shipping_address: "",
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  // Reviews
  // const reviews:Reviews = [
  //   {
  //     rating: 4.5,
  //     content: "Tirai sangat bagus dan berkualitas tinggi!",
  //     product_id: await prisma.product.findFirst({
  //       where: { slug: "tirai-blackout-premium" },
  //     }).then((product) => product?.id || ""),
  //     order_id: await prisma.order.findFirst({
  //       where: { phone_number: "081234567890" },
  //     }).then((order) => order?.id || ""),
  //   },
  //   {
  //     rating: 4.0,
  //     content: "Gorden dekoratif ini cocok sekali untuk ruang tamu.",
  //     product_id: await prisma.product.findFirst({
  //       where: { slug: "gorden-dekoratif-motif-bunga" },
  //     }).then((product) => product?.id || ""),
  //     order_id: await prisma.order.findFirst({
  //       where: { phone_number: "081234567891" },
  //     }).then((order) => order?.id || ""),
  //   },
  // ];

  // for (const review of reviews) {
  //   await prisma.review.create({
  //     data: review,
  //   });
  // }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
