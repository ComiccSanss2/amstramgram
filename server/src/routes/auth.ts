import { Router } from "express";
import type { User } from "../entities/index.js";
import type { CreateUserDto } from "../dtos/index.js";
import { addUser, findByEmail } from "../store/users.js";

const router = Router();

router.post("/register", (req, res) => {
  const body = req.body as CreateUserDto;
  const { email, mdp, pseudo, bPrivate } = body;
  if (!email || !mdp || !pseudo) {
    res.status(400).json({ error: "Champs requis" });
    return;
  }
  if (findByEmail(email)) {
    res.status(409).json({ error: "Email déjà utilisé" });
    return;
  }
  const user: User = {
    id: crypto.randomUUID(),
    email,
    mdp,
    pseudo,
    bPrivate: bPrivate ?? false,
    followers: [],
    following: [],
    bAdmin: false,
  };
  res.status(201).json(addUser(user));
});

router.post("/login", (req, res) => {
  const { email, mdp } = req.body as { email?: string; mdp?: string };
  if (!email || !mdp) {
    res.status(400).json({ error: "Champs requis" });
    return;
  }
  const user = findByEmail(email);
  if (!user || user.mdp !== mdp) {
    res.status(401).json({ error: "Identifiants incorrects" });
    return;
  }
  const { mdp: _, ...pub } = user;
  res.json(pub);
});

export default router;
