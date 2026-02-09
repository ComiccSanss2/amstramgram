import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (_req, res) => {
  res.json({ ok: true, message: "Amstramgram API" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
