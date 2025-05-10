import crypto from "crypto";
import bcrypt from "bcrypt";
import { Prisma, User } from "@prisma/client";
import prisma from "../../../../config/prismaClient";
import { selectItems, selectItems2 } from "./excludeAttributes";
import { InvalidParamError } from "../../../../errors/InvalidParamError";
import { NotAuthorizedError } from "../../../../errors/NotAuthorizedError";
import { PermissionError } from "../../../../errors/PermissionError";
import { QueryError } from "../../../../errors/QueryError";
import { UserRole } from "../types/UserRole";
import { JwtPayload } from "../../Auth/services/AuthService";

// Cargos e status válidos
const VALID_ROLES = ["Manager", "Administrator", "Member"];
const VALID_STATUS = ["Pending", "Active"];

class UserService {
  // Criptografa a senha utilizando bcrypt
  async encryptPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const encryptedPassword = await bcrypt.hash(password, saltRounds);
    return encryptedPassword;
  }

  // Cria um novo usuário após validar restrições e criptografar a senha
  async createUser(userData: User) {
    // Verifica se já existe um usuário com o mesmo email
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new QueryError("Esse email já está cadastrado.");
    }

    const roleToSet = userData.role && VALID_ROLES.includes(userData.role as UserRole)
      ? userData.role as UserRole
      : UserRole.MEMBER;

    if (userData.password != null) {
      const encryptedPassword = await this.encryptPassword(userData.password);

      const createdUser = await prisma.user.create({
        data: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          password: encryptedPassword,
          key: " ",
          cellphone: userData.cellphone,
          birth: userData.birth,
          status: "Pending",
          role: roleToSet,
          resetToken: null,
          tokenExpires: null,
        },
        select: selectItems,
      });

      return createdUser;
    }
  }

  // Retorna as informações de um usuário específico pelo ID
  async readUser(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: selectItems,
    });

    if (!user) {
      throw new QueryError("Id de usuário inexistente e/ou inválido");
    }

    return user;
  }

  // Retorna as informações do próprio usuário com atributos reduzidos
  async readMyUser(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: selectItems2,
    });

    if (!user) {
      throw new QueryError("Usuário inválido ou inexistente.");
    }

    return user;
  }

  // Retorna todos os usuários de acordo com o cargo do solicitante
  async readAllUsers(requester: JwtPayload) {
    if (requester.role === UserRole.ADMIN || requester.role === UserRole.MANAGER) {
      const users = await prisma.user.findMany({
        orderBy: { name: "asc" },
        select: selectItems,
      });
      return users;
    } else {
      throw new PermissionError("Você não tem permissão para listar todos os usuários.");
    }
  }

  // Permite que o administrador atualize as informações de um usuário
  async updateUserByAdmin(id: number, updateData: Partial<User>) {
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) { throw new Error("Usuário não encontrado."); }

    if (updateData.role !== undefined && updateData.role !== null && !VALID_ROLES.includes(updateData.role as UserRole)) {
      throw new InvalidParamError("Cargo inválido");
    }
    if (updateData.status !== undefined && updateData.status !== null && !VALID_STATUS.includes(updateData.status)) {
      throw new InvalidParamError("Status inválido");
    }
    if (updateData.password) {
      throw new NotAuthorizedError("Para alterar a senha de um usuário, use a rota específica de administrador.");
    }

    const dataToUpdate: Prisma.UserUpdateInput = {
      name: updateData.name,
      email: updateData.email,
      cellphone: updateData.cellphone,
      birth: updateData.birth,
      role: updateData.role as UserRole,
      status: updateData.status,
      photo: updateData.photo,
    };

    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: selectItems,
    });
    return updatedUser;
  }

  // Atualiza as informações da conta do próprio usuário, exceto cargo e status
  async updateAccount(id: number, newInfo: Partial<Omit<User, 'role' | 'status' | 'password'>>): Promise<Partial<User>> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) { throw new Error("Usuário não encontrado"); }

    // Validações para email, se necessário (já existente)
    if (newInfo.email && newInfo.email !== user.email) {
      const emailExists = await prisma.user.findUnique({ where: { email: newInfo.email } });
      if (emailExists && emailExists.id !== id) {
        throw new QueryError("Este email já está em uso por outra conta.");
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: newInfo.name,
        birth: newInfo.birth,
        email: newInfo.email,
        cellphone: newInfo.cellphone,
        // photo: newInfo.photo, // Se updatePhotoAccount for separado
      },
      select: selectItems,
    });
    return updatedUser;
  }

  // Atualiza a senha da conta após validar a senha antiga e a confirmação da nova senha
  async updatePasswordAccount(
    id: number,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) { throw new Error("Usuário não encontrado"); }
    if (!user.password) { throw new NotAuthorizedError("Usuário não possui senha cadastrada para alteração."); }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) { throw new InvalidParamError("A senha antiga está incorreta."); }
    if (newPassword !== confirmPassword) { throw new InvalidParamError("As novas senhas não coincidem."); }

    // Criptografa a nova senha
    const encryptedPassword = await this.encryptPassword(newPassword);

    // Atualiza a senha no banco de dados (atenção: a atualização não utiliza await)
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { password: encryptedPassword },
    });

    return updatedUser;
  }

  // Atualiza a senha do usuário com nova senha e confirmação
  async updatePassword(id: number, password: string, confirmPassword: string) {
    // Verifica se o usuário existe
    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists) { throw new Error("Usuário não encontrado"); }
    if (password !== confirmPassword) { throw new InvalidParamError("As senhas não coincidem."); }

    // Criptografa a senha e atualiza o usuário
    const encryptedPassword = await this.encryptPassword(password);
    await prisma.user.update({
      where: { id },
      data: { password: encryptedPassword },
    });
    return password;
  }

  // Atualiza a foto de perfil do usuário
  async updatePhotoAccount(id: number, image: any) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error("Esse usuário não existe");
    }

    // Extrai a chave e a URL da nova imagem
    const { key, location } = image;

    // Atualiza a foto e a chave do usuário
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        photo: location,
        key: key,
      },
    });

    return updatedUser;
  }

  // Deleta um usuário a partir do ID
  async deleteUser(id: number) {
    // Verifica se o usuário existe
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) { throw new InvalidParamError("Usuário não encontrado"); }

    // Deleta o usuário
    await prisma.usersProjects.deleteMany({ where: { userId: id } });

    await prisma.user.delete({ where: { id } });
    return existingUser;
  }
}

export default new UserService();
