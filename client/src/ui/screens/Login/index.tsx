import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Removido useNavigate
import './styles.css';

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    // Removido: const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        console.log('Tentando logar com:', { email, password });
        
        // Simulação (Lógica real virá depois)
        if (email === "certo@example.com") {
           console.log("Simulando login bem-sucedido...");
        } else {
           console.log("Simulando erro de login...");
           setError("Email ou senha inválidos (simulado).");
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-info-section">
                 <h1>Solutions ONE</h1>
                 <p>Gerenciando seus contratos em <strong>uma</strong> plataforma</p>
            </div>
            <div className="login-form-section">
                <div className="login-form-card">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="seuemail@example.com"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Senha</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Sua senha"
                            />
                            {/* Link para futura rota de recuperação */}
                            <Link to="/forgot-password" className="forgot-password-link">Esqueci a senha</Link>
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <button type="submit" className="login-button">Acessar</button>

                        <div className="register-link-container">
                           {/* Opção 1: Link se a rota /register existe/será criada */}
                           {/* <p>Não tem conta? <Link to="/register">Registre-se</Link></p> */}

                           {/* Opção 2: Placeholder se não houver registro por enquanto */}
                           <p>Não tem conta? Contate o administrador.</p> 
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;