import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LoginForm from './components/userForms/loginForm'
import RegisterForm from './components/userForms/registerForm'

function App() {
  return (
    <>
      <h1>Amstramgram</h1>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/feed" element={<div><h2>Feed</h2><p>Page du fil d'actualité</p></div>} />
        <Route path="/profile/:userId" element={<div><h2>Profil</h2><p>Page de profil utilisateur</p></div>} />
        <Route path="/post/:postId" element={<div><h2>Post</h2><p>Détail d'un post</p></div>} />
        <Route path="*" element={<div><h2>404</h2><p>Page non trouvée</p></div>} />
      </Routes>
    </>
  )
}

export default App