import { Router } from "express";
import { findById } from "../store/users.js";

const router = Router();

router.get("/:id", (req, res) => {
  const user = findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "Utilisateur non trouvé" });
  }
  const { mdp: _, ...pub } = user;
  res.json(pub);
});

export default router;
