import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";
import app from "../app.js";

vi.mock("../store/users.js", () => ({
  addUser: vi.fn(),
  findByEmail: vi.fn(),
}));

const { addUser, findByEmail } = await import("../store/users.js");

describe("POST /auth/register", () => {
  beforeEach(() => {
    vi.mocked(findByEmail).mockReturnValue(undefined);
  });

  it("retourne 400 si champs manquants", async () => {
    const res = await request(app).post("/auth/register").send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Champs requis");
  });

  it("retourne 409 si email déjà utilisé", async () => {
    vi.mocked(findByEmail).mockReturnValue({ id: "1", email: "a@a.com" } as any);
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "a@a.com", mdp: "secret", pseudo: "p" });
    expect(res.status).toBe(409);
    expect(res.body.error).toBe("Email déjà utilisé");
  });

  it("retourne 201 et un token si ok", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "new@test.com", mdp: "secret", pseudo: "user1" });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(addUser).toHaveBeenCalled();
  });
});

describe("POST /auth/login", () => {
  it("retourne 400 si champs manquants", async () => {
    const res = await request(app).post("/auth/login").send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Champs requis");
  });

  it("retourne 401 si identifiants incorrects", async () => {
    vi.mocked(findByEmail).mockReturnValue(undefined);
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "x@x.com", mdp: "wrong" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Identifiants incorrects");
  });

  it("retourne 200 et un token si ok", async () => {
    const hashedMdp = await bcrypt.hash("pass", 10);
    vi.mocked(findByEmail).mockReturnValue({
      id: "1",
      email: "u@u.com",
      mdp: hashedMdp,
      pseudo: "u",
    } as any);
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "u@u.com", mdp: "pass" });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
