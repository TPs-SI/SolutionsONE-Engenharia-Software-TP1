import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../domains/Auth/services/AuthService';

// Middleware para verificar o token JWT
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    console.log('AuthMiddleware executado para a rota:', req.path); // Log temporário
    next(); // Por enquanto, permite todas as requisições
};

export default authMiddleware;