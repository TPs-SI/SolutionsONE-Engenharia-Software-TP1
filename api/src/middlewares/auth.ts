import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../domains/Auth/services/AuthService';
import { LoginError } from '../../errors/LoginError';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new LoginError('Token de autenticação não fornecido ou mal formatado.'));
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.SECRET_KEY;

    if (!secret) {
        console.error("Erro crítico: SECRET_KEY não definida no ambiente para validação de token.");
        return next(new Error("Erro interno na configuração de autenticação."));
    }

    try {
        const decodedPayload = jwt.verify(token, secret) as JwtPayload;
        // @ts-ignore 
        req.user = decodedPayload;
        next();

    } catch (error) {
        console.error("Erro na verificação do token:", error);
        let errorMessage = 'Token inválido ou expirado.';
        if (error instanceof jwt.TokenExpiredError) {
            errorMessage = 'Token expirado.';
        } else if (error instanceof jwt.JsonWebTokenError) {
             errorMessage = 'Token inválido.';
        }
        return next(new LoginError(errorMessage));
    }
};

export default authMiddleware;