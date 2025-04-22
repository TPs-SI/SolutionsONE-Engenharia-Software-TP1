import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../../Services/api';
import { LoginCredentials } from '../../../domain/models/auth';
import { useAuth } from '../../../context/AuthContext';

import './styles.css'; 
const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/projects');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setIsLoading(true);
        const credentials: LoginCredentials = { email, password };

        try {
            const response = await loginUser(credentials);
            login(response.token);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ocorreu um erro inesperado.");
            console.error("Falha no login:", err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isAuthenticated) {
        return null; 
    }

    return (
        <div className="login-page-container">
            {/* Seção Esquerda */}
            <div className="login-info-section">
                 {/* Aplicando estilo ao ONE e 'uma' */}
                 <h1>Solutions <span className="solutions-one-highlight">ONE</span></h1>
                 <p>Gerenciando seus contratos em <strong className="emphasis-yellow">uma</strong> plataforma</p>
            </div>

            {/* Seção Direita */}
            <div className="login-form-section">
                <div className="login-form-card">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            {/* Label pode ser opcional se o placeholder for suficiente */}
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
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
                                disabled={isLoading}
                            />
                             {/* Link agora usa classe para estilização */}
                            <Link to="/forgot-password" className="forgot-password-link">Esqueci a senha</Link>
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Acessando...' : 'Acessar'}
                        </button>

                         {/* Link de Registro atualizado */}
                        <div className="register-link-container">
                           <Link to="#" className="register-link">Registre-se</Link>
                           {/* Ou <a href="#" className="register-link">Registre-se</a> se preferir */}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;