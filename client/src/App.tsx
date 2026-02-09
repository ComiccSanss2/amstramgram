import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CreatePost } from './pages/CreatePost';
import { PostDetail } from './pages/PostDetail';
import { Feed } from './pages/Feed';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* La page d'accueil est maintenant le Feed */}
        <Route path="/" element={<Feed />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;