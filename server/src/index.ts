import express from "express";
import cors from "cors"; 
import postRoutes from "./routes/post.routes.js"; 

const app = express();
const PORT = 3000;

app.use(cors()); 
app.use(express.json()); 

app.get("/", (_req, res) => {
  res.json({ ok: true, message: "Amstramgram API ready!" });
});

app.use("/api/posts", postRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});