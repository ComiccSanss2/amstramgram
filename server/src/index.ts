import app from "./app.js";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`   - Auth:   http://localhost:${PORT}/auth`);
  console.log(`   - Posts:  http://localhost:${PORT}/api/posts`);
  console.log(`   - Users:  http://localhost:${PORT}/api/users`);
});
