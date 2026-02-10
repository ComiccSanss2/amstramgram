import express from "express";
import cors from "cors";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ ok: true, message: "Amstramgram API ready!" });
});

app.use("/auth", authRoutes);
app.use("/api", authMiddleware);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});