const express = require("express");
const bcrypt = require("bcryptjs");
const prisma = require("../prisma");
const { verifyToken, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(verifyToken);

function scopeToOwnCabang(req) {
  if (req.user.role === "ADMIN_CABANG") {
    return { cabangId: req.user.cabangId };
  }
  return {};
}

router.get("/", requireRole("ADMIN_PUSAT", "ADMIN_CABANG"), async (req, res) => {
  const users = await prisma.user.findMany({
    where: scopeToOwnCabang(req),
    select: { id: true, nama: true, email: true, role: true, cabangId: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(users);
});

router.post("/", requireRole("ADMIN_PUSAT", "ADMIN_CABANG"), async (req, res) => {
  const { nama, email, password, role, cabangId, mapel, tarifPerSesi } = req.body;
  if (!nama || !email || !password || !role) {
    return res.status(400).json({ error: "Nama, email, password, dan role wajib diisi" });
  }

  if (req.user.role === "ADMIN_CABANG" && role === "ADMIN_PUSAT") {
    return res.status(403).json({ error: "Admin Cabang tidak bisa membuat Admin Pusat" });
  }

  const effectiveCabangId =
    req.user.role === "ADMIN_CABANG" ? req.user.cabangId : cabangId || null;

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      nama,
      email,
      passwordHash,
      role,
      cabangId: role === "ADMIN_PUSAT" ? null : effectiveCabangId,
    },
  });

  if (role === "TUTOR") {
    await prisma.tutor.create({
      data: {
        userId: user.id,
        mapel: mapel || "",
        tarifPerSesi: tarifPerSesi || 0,
      },
    });
  }

  res.status(201).json({ id: user.id, nama: user.nama, email: user.email, role: user.role });
});

router.delete("/:id", requireRole("ADMIN_PUSAT", "ADMIN_CABANG"), async (req, res) => {
  const target = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!target) return res.status(404).json({ error: "Pengguna tidak ditemukan" });

  if (req.user.role === "ADMIN_CABANG" && target.cabangId !== req.user.cabangId) {
    return res.status(403).json({ error: "Tidak punya akses ke pengguna cabang lain" });
  }

  await prisma.user.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

module.exports = router;
