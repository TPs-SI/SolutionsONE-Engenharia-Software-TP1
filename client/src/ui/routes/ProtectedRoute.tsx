import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Componente para proteger rotas
const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth(); 
    const location = useLocation(); 

    if (isLoading) {
        return <div>Carregando autenticação...</div>; 
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />; 
};

export default ProtectedRoute;