import { User } from "@prisma/client";
import prisma from "../../../../config/prismaClient";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import ms from "ms";
import crypto from 'crypto'; // <-- Importar crypto
import { LoginError } from "../../../../errors/LoginError";
import { QueryError } from "../../../../errors/QueryError";
import { sendPasswordResetEmail } from "../../../../utils/functions/sendEmail";

export interface JwtPayload {
    userId: number;
    role: string | null;
}

const hashResetToken = (token: string): string => {
    return crypto.createHash('sha256').update(token).digest('hex');
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

    /**
    * Gera um token de reset de senha, salva seu hash no DB e envia email.
    * @param email - Email do usuário solicitante.
    */
    async createPasswordResetToken(email: string): Promise<void> {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // IMPORTANTE: Mesmo que o usuário não exista, NÃO retorne um erro
        // dizendo "usuário não encontrado". Isso vaza informação se um email
        // está cadastrado ou não. Apenas retorne (ou logue) sem fazer nada.
        if (!user) {
            console.log(`Solicitação de reset para email não encontrado: ${email}`);
            return;
        }

        const rawToken = crypto.randomBytes(32).toString('hex'); 
        const hashedToken = hashResetToken(rawToken);
        const expires = new Date();
        expires.setHours(expires.getHours() + 1);

        try {
            await prisma.user.update({
                where: { email: email },
                data: {
                    resetToken: hashedToken,
                    tokenExpires: expires,
                },
            });
        } catch (dbError) {
            console.error(`Erro ao salvar token de reset para ${email}:`, dbError);
            throw new Error("Falha ao processar a solicitação de recuperação.");
        }

        try {
            await sendPasswordResetEmail({
                email: user.email,
                token: rawToken, 
                userName: user.name,
            });
            console.log(`Email de reset enviado para ${email}`);
        } catch (emailError) {
            // O que fazer se o email falhar? O token já foi salvo.
            // Idealmente, logar o erro extensivamente. Pode-se tentar reverter
            // a atualização do DB ou apenas informar um erro genérico.
            console.error(`Falha crítica ao enviar email de reset para ${email} após salvar token.`, emailError);
            // Lançar erro genérico para o usuário. A falha no envio não deve
            // impedir que o processo pareça ter funcionado do ponto de vista de segurança.
            throw new Error("Falha ao processar a solicitação de recuperação.");
        }
    }
}

export default new AuthService();