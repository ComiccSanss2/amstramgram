import type { Request } from "express";
import { Router } from "express";
import { findById } from "../store/users.js";

const router = Router();

router.get("/me", (req, res) => {
  const userId = (req as Request & { userId: string }).userId;
  const user = findById(userId);
  if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
  const { mdp: _, ...pub } = user;
  res.json(pub);
});

router.get("/:id", (req, res) => {
  const user = findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "Utilisateur non trouvé" });
  }
  const { mdp: _, ...pub } = user;
  res.json(pub);
});

export default router;
