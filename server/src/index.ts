import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js"; 
import postRoutes from "./routes/post.routes.js"; 
import userRoutes from "./routes/user.routes.js"; 

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get("/", (_req, res) => {
  res.json({ ok: true, message: "Amstramgram API is running" });
});


app.use("/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`   - Auth:   http://localhost:${PORT}/auth`);
  console.log(`   - Posts:  http://localhost:${PORT}/api/posts`);
  console.log(`   - Users:  http://localhost:${PORT}/api/users`);
});