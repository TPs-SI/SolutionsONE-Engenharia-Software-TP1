import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface AuthState {
    token: string | null;
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        token: null,
        isAuthenticated: false,
        isLoading: true,
    });

    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('authToken');
            if (storedToken) {
                setAuthState({ token: storedToken, isAuthenticated: true, isLoading: false });
            } else {
                 setAuthState(prev => ({ ...prev, isLoading: false }));
            }
        } catch (error) {
             console.error("Erro ao ler token do localStorage:", error);
             setAuthState(prev => ({ ...prev, isLoading: false }));
        }
    }, []);

    const login = (token: string) => {
        try {
            localStorage.setItem('authToken', token);
            setAuthState({ token: token, isAuthenticated: true, isLoading: false });
        } catch (error) {
             console.error("Erro ao salvar token no localStorage:", error);
        }
    };

    const logout = () => {
        try {
            localStorage.removeItem('authToken');
            setAuthState({ token: null, isAuthenticated: false, isLoading: false });
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

// Hook customizado para facilitar o uso do contexto
export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};