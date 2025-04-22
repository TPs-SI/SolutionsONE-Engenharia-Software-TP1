import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginUser } from '../../../Services/api'; 
import { LoginCredentials } from '../../../domain/models/auth'; 

import './styles.css';

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false); 

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null); 
        setIsLoading(true);

        const credentials: LoginCredentials = { email, password };

        try {
            // Chamar a função real da API
            const response = await loginUser(credentials); 
            
            console.log('Login bem-sucedido! Token:', response.token); 

        } catch (err) {
            // Exibir o erro retornado pela função loginUser (ou um padrão)
            if (err instanceof Error) {
                 setError(err.message); 
            } else {
                 setError("Ocorreu um erro inesperado.");
            }
            console.error("Falha no login:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page-container">
            {/* Seção de Informações*/}
            <div className="login-info-section">
                 <h1>Solutions ONE</h1>
                 <p>Gerenciando seus contratos em <strong>uma</strong> plataforma</p>
            </div>
            {/* Seção do Formulário */}
            <div className="login-form-section">
                <div className="login-form-card">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        {/* Campo Email */}
                        <div className="form-group">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                                placeholder="seuemail@example.com"
                            />
                        </div>
                         {/* Campo Senha */}
                        <div className="form-group">
                            <label htmlFor="password">Senha</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                                placeholder="Sua senha"
                            />
                            <Link to="/forgot-password" className="forgot-password-link">Esqueci a senha</Link>
                        </div>

                        {/* Exibir erro real da API */}
                        {error && <p className="error-message">{error}</p>}
                        <button 
                            type="submit" 
                            className="login-button" 
                            disabled={isLoading} // Desabilitar durante carregamento
                        >
                            {isLoading ? 'Acessando...' : 'Acessar'} {/* Mudar texto durante carregamento */}
                        </button>

                        {/* Link Registro */}
                        <div className="register-link-container">
                           <p>Não tem conta? Contate o administrador.</p> 
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;