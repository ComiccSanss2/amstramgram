import type { Request, Response } from "express";
import { searchByPseudo } from "../store/users.js";

function bad(res: Response, msg: string, status = 400) {
  return res.status(status).json({ error: msg });
}

export function searchUsers(req: Request, res: Response) {
  const q = (req.query.q as string) ?? "";
  const results = searchByPseudo(q);
  res.json({ data: results });
}