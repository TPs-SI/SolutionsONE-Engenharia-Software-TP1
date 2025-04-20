import { User } from "@prisma/client";
import prisma from "../../../../config/prismaClient";
import bcrypt from "bcryptjs";
import { LoginError } from "../../../../errors/LoginError"; // Usando erro customizado

class AuthService {
    /**
     * Valida as credenciais do usuário.
     * Retorna os dados do usuário (sem senha) se as credenciais forem válidas.
     * Lança LoginError se as credenciais forem inválidas ou o usuário/senha não existir.
     */
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
}

export default new AuthService();