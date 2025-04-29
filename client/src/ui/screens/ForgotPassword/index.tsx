import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../../../Services/api';
import { ForgotPasswordDTO } from '../../../domain/models/auth';

import './styles.css'; 

const ForgotPasswordScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<string | null>(null); 
    const [error, setError] = useState<string | null>(null); 
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null); 
        setMessage(null); 
        setIsLoading(true);

        const payload: ForgotPasswordDTO = { email }; 

        try {
             const response = await requestPasswordReset(payload); 
             
             setMessage(response.message);

        } catch (err) {
             setError(err instanceof Error ? err.message : "Ocorreu um erro.");
             console.error("Erro na solicitação de recuperação:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page-container"> 
            <div className="auth-form-card">
                <div className="auth-logo">ONE</div> 
            
                <h2>Esqueci a senha</h2>
                <p className="auth-subtitle">
                    Insira seu endereço de e-mail e enviaremos um código para redefinir sua senha.
                </p>

                <form onSubmit={handleSubmit}>
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

                    {message && !error && <p className="info-message">{message}</p>} 
                    {error && <p className="error-message">{error}</p>}

                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Enviando...' : 'Enviar código'}
                    </button>
                </form>

                <div className="auth-link-container"> 
                    <Link to="/login" className="auth-link">Voltar ao login</Link> 
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordScreen;