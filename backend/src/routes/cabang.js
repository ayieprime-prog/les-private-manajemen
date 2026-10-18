const express = require("express");
const prisma = require("../prisma");
const { verifyToken, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(verifyToken);

router.get("/", async (req, res) => {
  const cabang = await prisma.cabang.findMany({ orderBy: { nama: "asc" } });
  res.json(cabang);
});

router.post("/", requireRole("ADMIN_PUSAT"), async (req, res) => {
  const { nama, alamat, telepon } = req.body;
  if (!nama) return res.status(400).json({ error: "Nama cabang wajib diisi" });

  const cabang = await prisma.cabang.create({ data: { nama, alamat, telepon } });
  res.status(201).json(cabang);
});

router.put("/:id", requireRole("ADMIN_PUSAT"), async (req, res) => {
  const { nama, alamat, telepon } = req.body;
  const cabang = await prisma.cabang.update({
    where: { id: req.params.id },
    data: { nama, alamat, telepon },
  });
  res.json(cabang);
});

router.delete("/:id", requireRole("ADMIN_PUSAT"), async (req, res) => {
  await prisma.cabang.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

module.exports = router;
