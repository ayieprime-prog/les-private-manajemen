const bcrypt = require("bcryptjs");
const prisma = require("../src/prisma");

async function main() {
  const existing = await prisma.user.findFirst({ where: { role: "ADMIN_PUSAT" } });
  if (existing) {
    console.log("Admin Pusat sudah ada, seed dilewati.");
    return;
  }

  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      nama: "Admin Pusat",
      email: "admin@lesprivat.local",
      passwordHash,
      role: "ADMIN_PUSAT",
    },
  });

  console.log("Admin Pusat dibuat: admin@lesprivat.local / admin123");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
