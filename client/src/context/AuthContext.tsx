import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode'; // Importar jwt-decode

// Interface para o payload decodificado do token (conforme definido no backend)
interface DecodedToken {
    userId: number;
    role: string | null; // Ou UserRole se você tiver um enum no frontend
    iat?: number; // Issued at (opcional, mas comum)
    exp?: number; // Expiration time (opcional, mas comum)
}

// Interface para os dados do usuário que queremos expor no contexto
interface UserContextData {
    id: number | null;
    role: string | null;
}

interface AuthState {
    token: string | null;
    user: UserContextData | null; 
    isAuthenticated: boolean;
    isLoading: boolean;
}

interface AuthContextProps extends AuthState {
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

// Função auxiliar para decodificar e extrair dados do usuário do token
const getUserDataFromToken = (token: string): UserContextData | null => {
    try {
        const decoded = jwtDecode<DecodedToken>(token);
        // Verifica se os campos esperados existem e se o token não expirou (opcional)
        if (decoded && decoded.userId && decoded.role !== undefined) {
            if (decoded.exp && Date.now() >= decoded.exp * 1000) {
                console.warn("Token JWT expirado.");
                localStorage.removeItem('authToken'); // Remove token expirado
                return null;
            }
            return { id: decoded.userId, role: decoded.role };
        }
        return null;
    } catch (error) {
        console.error("Erro ao decodificar token JWT:", error);
        localStorage.removeItem('authToken'); // Remove token inválido
        return null;
    }
};


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });

    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('authToken');
            if (storedToken) {
                const userData = getUserDataFromToken(storedToken);
                if (userData) {
                    setAuthState({
                        token: storedToken,
                        user: userData,
                        isAuthenticated: true,
                        isLoading: false
                    });
                } else {
                    // Token inválido ou expirado foi removido pelo getUserDataFromToken
                    setAuthState({ token: null, user: null, isAuthenticated: false, isLoading: false });
                }
            } else {
                 setAuthState(prev => ({ ...prev, user: null, isLoading: false }));
            }
        } catch (error) {
             console.error("Erro ao processar token do localStorage:", error);
             setAuthState({ token: null, user: null, isAuthenticated: false, isLoading: false });
        }
    }, []);

    const login = (token: string) => {
        try {
            const userData = getUserDataFromToken(token);
            if (userData) {
                localStorage.setItem('authToken', token);
                setAuthState({
                    token: token,
                    user: userData,
                    isAuthenticated: true,
                    isLoading: false
                });
            } else {
                // Token fornecido no login é inválido/expirado
                localStorage.removeItem('authToken');
                setAuthState({ token: null, user: null, isAuthenticated: false, isLoading: false });
            }
        } catch (error) {
             console.error("Erro ao salvar e decodificar token no login:", error);
        }
    };

    const logout = () => {
        try {
            localStorage.removeItem('authToken');
            setAuthState({ token: null, user: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
             console.error("Erro ao remover token do localStorage:", error);
        }
    };

    if (authState.isLoading) {
        return null; 
    }

    return (
        <AuthContext.Provider value={{ ...authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};