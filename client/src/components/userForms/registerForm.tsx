import { useState } from 'react';
import '../../styles/userForms.css';
import { Link } from 'react-router-dom';

interface RegisterDto {
  nomUtilisateur: string;
  email: string;
  mdp: string;
  confirmMdp: string;
}

function RegisterForm() {
  const [formData, setFormData] = useState<RegisterDto>({
    nomUtilisateur: '',
    email: '',
    mdp: '',
    confirmMdp: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (formData.mdp !== formData.confirmMdp) {
        console.error('Les mots de passe ne correspondent pas');
        return;
      }

      console.log('Données d\'inscription:', formData);
      
      // const response = await fetch('http://localhost:3000/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     nomUtilisateur: formData.nomUtilisateur,
      //     email: formData.email,
      //     mdp: formData.mdp
      //   })
      // });
      // const data = await response.json();
      
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
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
            <label htmlFor="nomUtilisateur">Nom d'utilisateur :</label>
            <input
                type="text"
                id="nomUtilisateur"
                name="nomUtilisateur"
                value={formData.nomUtilisateur}
                onChange={handleChange}
                required
            />
            </div>

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

            <div className="form-group">
            <label htmlFor="confirmMdp">Confirmer le mot de passe :</label>
            <input
                type="password"
                id="confirmMdp"
                name="confirmMdp"
                value={formData.confirmMdp}
                onChange={handleChange}
                required
            />
            </div>

            <button type="submit">S'inscrire</button>
        </form>

        <p>Vous avez déjà un compte ? <Link to="/login">Se connecter</Link></p>
        </div>
    </>
  );
}

export default RegisterForm;