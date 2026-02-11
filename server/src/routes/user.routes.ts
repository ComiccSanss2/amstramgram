import type { Request } from "express";
import { Router } from "express";
import { findById, followUser, unfollowUser } from "../store/users.js";
import { error } from "node:console";

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

router.post("/:id/follow", (req, res) => {
  const targetId = req.params.id;
  const {id_user} = req.body;

  if (!id_user) return res.status(400).json({ error : "ID utilisateur requis" });

  const success = followUser(id_user, targetId);
  if (!success) return res.status(400).json({ erreur : "Action impossible" });

  res.json({ success: true});
});

router.post("/:id/unfollow", (req, res) => {
    const targetId = req.params.id;
  const {id_user} = req.body;

  if (!id_user) return res.status(400).json({ error : "ID utilisateur requis" });

  const success = unfollowUser(id_user, targetId);
  if (!success) return res.status(400).json({ erreur : "Action impossible" });

  res.json({ success: true});
});
export default router;
