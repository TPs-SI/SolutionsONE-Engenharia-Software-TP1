import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginUser } from '../../../Services/api'; 
import { LoginCredentials } from '../../../domain/models/auth'; 
// Importar o hook useAuth
import { useAuth } from '../../../context/AuthContext'; 

import './styles.css';

const LoginScreen: React.FC = () => {
    // Estados locais do formulário (inalterados)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false); 

    // Obter a função login do contexto
    const { login } = useAuth(); 

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null); 
        setIsLoading(true); 

        const credentials: LoginCredentials = { email, password };

        try {
            const response = await loginUser(credentials); 
            
            // Chamar a função login do contexto para armazenar token e atualizar estado
            login(response.token); 

            // Log de confirmação (pode remover depois)
            console.log('Login bem-sucedido, estado atualizado e token armazenado.');

            // Redirecionamento virá no próximo commit

        } catch (err) {
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
             {/* ... (seção info inalterada) ... */}
             <div className="login-info-section">
                 <h1>Solutions ONE</h1>
                 <p>Gerenciando seus contratos em <strong>uma</strong> plataforma</p>
            </div>
            {/* ... (seção form inalterada, inputs e botão ainda usam isLoading) ... */}
             <div className="login-form-section">
                <div className="login-form-card">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                         {/* ... (campos email e senha inalterados) ... */}
                         <div className="form-group">
                            <label htmlFor="email">E-mail</label>
                            <input /* ... */ disabled={isLoading} />
                        </div>
                         <div className="form-group">
                            <label htmlFor="password">Senha</label>
                            <input /* ... */ disabled={isLoading} />
                            <Link to="/forgot-password" className="forgot-password-link">Esqueci a senha</Link>
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <button type="submit" className="login-button" disabled={isLoading}>
                            {isLoading ? 'Acessando...' : 'Acessar'}
                        </button>

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