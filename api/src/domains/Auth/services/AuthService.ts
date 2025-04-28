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
        // 1. Encontrar usuário pelo email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // 2. Silenciosamente retornar se o usuário não for encontrado (segurança)
        if (!user) {
            console.log(`Solicitação de reset para email não encontrado: ${email}. Nenhuma ação tomada.`);
            // Retorna sem erro para o controller, que enviará a msg genérica.
            return; 
        }

        // 3. Gerar o token RAW (para o email)
        const rawToken = crypto.randomBytes(32).toString('hex'); 

        // 4. Gerar o HASH do token (para o DB)
        const hashedToken = hashResetToken(rawToken);

        // 5. Definir a data de expiração (1 hora a partir de agora)
        const expires = new Date();
        expires.setHours(expires.getHours() + 1); 

        // 6. Tentar salvar o HASH e a data de expiração no usuário
        try {
            await prisma.user.update({
                where: { email: email },
                data: {
                    resetToken: hashedToken, // Salva o HASH
                    tokenExpires: expires,
                },
            });
            console.log(`Token de reset (hash) salvo para ${email}`);
        } catch (dbError) {
            // Log detalhado do erro do banco de dados
            console.error(`Erro ao salvar token de reset no DB para ${email}:`, dbError);
            // Lança erro genérico para ser pego pelo controller/errorHandler
            throw new Error("Falha ao processar a solicitação de recuperação."); 
        }

        // 7. Tentar enviar o email com o token RAW
        try {
            await sendPasswordResetEmail({
                email: user.email,
                token: rawToken, // Envia o token ORIGINAL
                userName: user.name,
            });
            console.log(`Email de reset enviado para ${email}`);
        } catch (emailError) {
            // Log detalhado do erro de email
            console.error(`Falha crítica ao enviar email de reset para ${email} após salvar token.`, emailError);
            // Lança erro genérico. O token está no DB, mas o usuário não o recebeu.
            // Poderíamos tentar reverter a atualização do DB aqui, mas é complexo.
            // É importante logar extensivamente.
            throw new Error("Falha ao processar a solicitação de recuperação.");
        }
    }
}

export default new AuthService();