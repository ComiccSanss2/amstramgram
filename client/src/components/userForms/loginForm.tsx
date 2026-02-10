import { useState } from 'react';
import '../../styles/userForms.css';
import { Link } from 'react-router-dom';

interface LoginDto {
  email: string;
  mdp: string;
}

function LoginForm() {
  const [formData, setFormData] = useState<LoginDto>({
    email: '',
    mdp: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Données de connexion:', formData);
      
      // const response = await fetch('http://localhost:3000/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      // const data = await response.json();
      
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="mdp">Mot de passe :</label>
          <input
            type="password"
            id="mdp"
            name="mdp"
            value={formData.mdp}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Se connecter</button>
      </form>

      <p>Vous n'avez pas de compte ? <Link to="/register">Créer un compte</Link></p>
    </div>
    </>
  );
}

export default LoginForm;