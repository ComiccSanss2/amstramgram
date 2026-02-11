import express from "express";
import cors from "cors";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.get("/", (_req, res) => {
  res.json({ ok: true, message: "Amstramgram API is running" });
});

app.use("/auth", authRoutes);
app.use("/api", authMiddleware);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

export default app;
