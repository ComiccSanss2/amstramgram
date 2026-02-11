import type { Request } from "express";
import { Router } from "express";
import type { UpdateUserDto } from "../dtos/index.js";
import { findById, updateUser } from "../store/users.js";
import { searchUsers } from "../controllers/userController.js";

const router: Router = Router();

router.get("/search", searchUsers);

router.put("/me", (req, res) => {
  const userId = (req as Request & { userId: string }).userId;
  const body = req.body as UpdateUserDto;
  const { email, mdp, pseudo, bPrivate } = body;

  const updates: { email?: string; mdp?: string; pseudo?: string; bPrivate?: boolean } = {};
  if (email !== undefined) updates.email = email;
  if (mdp !== undefined) updates.mdp = mdp;
  if (pseudo !== undefined) updates.pseudo = pseudo;
  if (bPrivate !== undefined) updates.bPrivate = bPrivate;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "Aucune modification fournie" });
  }

  if (pseudo !== undefined && !pseudo.trim()) {
    return res.status(400).json({ error: "Pseudo requis" });
  }
  if (email !== undefined && !email.trim()) {
    return res.status(400).json({ error: "Email requis" });
  }

  const updated = updateUser(userId, updates);
  if (!updated) {
    return res.status(409).json({ error: "Email déjà utilisé" });
  }

  const { mdp: _, ...pub } = updated;
  res.json(pub);
});

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
