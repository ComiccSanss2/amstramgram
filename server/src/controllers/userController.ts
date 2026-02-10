import type { Request, Response } from 'express';


function bad(res: Response, msg: string, status = 400) {
    return res.status(status).json({ error: msg });
  }