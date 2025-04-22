import { User } from "@prisma/client";
import prisma from "../../../../config/prismaClient";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import ms from "ms";
import { LoginError } from "../../../../errors/LoginError";

interface JwtPayload {
    userId: number;
    role: string | null;
}

class AuthService {
    // Função de validação permanece a mesma
    async validateUserCredentials(email: string, passwordInput: string): Promise<Omit<User, 'password'>> {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        if (!user) {
            throw new LoginError("Email ou senha inválidos.");
        }
        if (!user.password) {
            console.error(`Tentativa de login para usuário sem senha: ${email}`);
            throw new LoginError("Email ou senha inválidos.");
        }
        const isPasswordValid = await bcrypt.compare(passwordInput, user.password);
        if (!isPasswordValid) {
            throw new LoginError("Email ou senha inválidos.");
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    /**
     * Realiza o login do usuário: valida credenciais e gera um token JWT.
     * Retorna um objeto contendo o token JWT.
     * Lança LoginError para credenciais inválidas ou Error para falhas internas.
     */
    async login(email: string, passwordInput: string): Promise<{ token: string }> {
        const validatedUser = await this.validateUserCredentials(email, passwordInput);

        const secret = process.env.SECRET_KEY;
        const defaultDurationString = '7d';
        const durationString = process.env.JWT_EXPIRATION || defaultDurationString;

        if (!secret) {
            console.error("Erro crítico: SECRET_KEY não definida no ambiente. Impossível gerar token JWT.");
            throw new Error("Erro interno do servidor ao processar a autenticação.");
        }

        const expiresInMilliseconds = ms(durationString as ms.StringValue);

        let expiresInSeconds: number;

        if (expiresInMilliseconds === undefined) {
            console.warn(`Valor inválido para JWT_EXPIRATION: "${durationString}". Usando padrão "${defaultDurationString}".`);
            const fallbackMilliseconds = ms(defaultDurationString as ms.StringValue);
            if (fallbackMilliseconds === undefined) { 
                 throw new Error("Erro interno na configuração de expiração do token padrão.");
            }
            expiresInSeconds = fallbackMilliseconds / 1000;
        } else {
            expiresInSeconds = expiresInMilliseconds / 1000;
        }

        const payload: JwtPayload = {
            userId: validatedUser.id,
            role: validatedUser.role
        };

        const signOptions: SignOptions = {
            expiresIn: expiresInSeconds
        };

        try {
            const token = jwt.sign(
                payload,
                secret,
                signOptions
            );
            return { token };
        } catch (error) {
            console.error("Erro ao gerar token JWT:", error);
            throw new Error("Erro interno do servidor ao processar o login.");
        }
    }
}

export default new AuthService();