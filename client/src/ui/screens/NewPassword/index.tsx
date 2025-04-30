import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { resetPassword } from '../../../Services/api';
import { ResetPasswordDTO } from '../../../domain/models/auth';
import './styles.css';

const NewPasswordScreen: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { token } = useParams<{ token: string }>();

    useEffect(() => {
        if (!token) {
            console.error("Token não encontrado na URL.");
            setError("Link de redefinição inválido ou ausente.");
        }
    }, [token]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setMessage(null);

        if (!token) {
            setError("Link de redefinição inválido ou ausente.");
            return;
        }

        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        setIsLoading(true);

        const payload: ResetPasswordDTO = { newPassword: password, confirmPassword };

        try {
            const response = await resetPassword(token, payload);

            setMessage(response.message);
            setPassword('');
            setConfirmPassword('');

        } catch (err) {
            setError(err instanceof Error ? err.message : "Ocorreu um erro inesperado ao redefinir a senha.");
            console.error("Erro ao resetar senha:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-form-card">
                <div className="auth-logo">ONE</div>
                <h2>Nova senha</h2>

                {/* Se houver mensagem de sucesso, mostra só ela e o link */}
                {message ? (
                    <div className="success-container">
                        <p className="success-message">{message}</p>
                        <div className="auth-link-container">
                            <Link to="/login" className="auth-link">Ir para Login</Link>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="auth-subtitle">
                            Escolha sua nova senha de acesso.
                        </p>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="password">Nova senha</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading || !token}
                                    aria-invalid={!!error}
                                    aria-describedby={error ? "password-error" : undefined}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirme a senha</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={isLoading || !token}
                                    aria-invalid={!!error}
                                    aria-describedby={error ? "password-error" : undefined}
                                />
                            </div>

                            {error && <p id="password-error" className="error-message">{error}</p>}

                            {/* Mostra botão apenas se o link for válido (token existe) */}
                            {token && (
                                <button
                                    type="submit"
                                    className="auth-button"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Salvando...' : 'Salvar Senha'}
                                </button>
                            )}
                        </form>
                        {/* Link para login se o link original for inválido */}
                        {!token && (
                            <div className="auth-link-container">
                                <Link to="/login" className="auth-link">Voltar ao login</Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default NewPasswordScreen;