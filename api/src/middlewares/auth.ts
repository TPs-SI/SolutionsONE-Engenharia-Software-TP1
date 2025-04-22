import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../domains/Auth/services/AuthService';
import { LoginError } from '../../errors/LoginError'; 

// Middleware para verificar o token JWT
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    // 1. Verificar se o header existe e está no formato correto (Bearer)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new LoginError('Token de autenticação não fornecido ou mal formatado.'));
    }

    // 2. Extrair o token (remover o 'Bearer ')
    const token = authHeader.split(' ')[1];

    // 3. Verificar o token
    const secret = process.env.SECRET_KEY;
    if (!secret) {
        console.error("Erro crítico: SECRET_KEY não definida no ambiente para validação de token.");
        return next(new Error("Erro interno na configuração de autenticação.")); 
    }

    try {
        const decodedPayload = jwt.verify(token, secret) as JwtPayload;
        // 4. Anexar payload decodificado ao request para uso posterior (próximo commit)
        // req.user = decodedPayload; 

        console.log('Token válido para userId:', decodedPayload.userId); 
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