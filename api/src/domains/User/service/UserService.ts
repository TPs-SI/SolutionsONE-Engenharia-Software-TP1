import crypto from "crypto";
import bcrypt from "bcrypt";

import { User } from "@prisma/client";
import prisma from "../../../../config/prismaClient";
import { selectItems, selectItems2 } from "./excludeAttributes";

import { InvalidParamError } from "../../../../errors/InvalidParamError";
import { NotAuthorizedError } from "../../../../errors/NotAuthorizedError";
import { PermissionError } from "../../../../errors/PermissionError";
import { QueryError } from "../../../../errors/QueryError";

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

    // Impede que o próprio usuário defina seu cargo ou status
    if (userData.role != null) {
      throw new NotAuthorizedError("Não é possível inserir o próprio cargo.");
    }

    if (userData.status != null) {
      throw new NotAuthorizedError("Não é possível inserir o próprio status.");
    }

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
          role: null,
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
  async readAllUsers(requesterId: number) {
    const requesterAccount = await prisma.user.findUnique({
      where: { id: requesterId },
    });

    if (true) { // requesterAccount?.role === "Administrator" || requesterAccount?.role === "Manager"
      const users = await prisma.user.findMany({
        orderBy: { name: "asc" },
        select: selectItems,
      });

      if (users && users.length > 0) {
        return users;
      } else {
        throw new QueryError("A lista de usuários está vazia.");
      }
    } else if (requesterAccount?.role === "Member") {
      const activeUsers = await prisma.user.findMany({
        where: { status: "Active" },
        select: selectItems,
      });

      if (activeUsers && activeUsers.length > 0) {
        return activeUsers;
      } else {
        throw new QueryError("Nenhum usuário está ativo");
      }
    } else {
      throw new PermissionError("Você não tem o cargo necessário para visualizar os usuários");
    }
  }

  // Permite que o administrador atualize as informações de um usuário
  async updateUserByAdmin(id: number, updateData: Partial<User>) {
    // Verifica se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new Error("Usuário não encontrado.");
    }

    // Valida o cargo se fornecido
    if (updateData.role !== undefined && updateData.role !== null) {
      if (!VALID_ROLES.includes(updateData.role)) {
        throw new Error("Cargo inválido");
      }
    }

    // Valida o status se fornecido
    if (updateData.status !== undefined && updateData.status !== null) {
      if (!VALID_STATUS.includes(updateData.status)) {
        throw new Error("Status inválido");
      }
    }

    // Impede alteração da foto
    if (updateData.photo && updateData.photo !== existingUser.photo) {
      throw new Error("Você não tem permissão para alterar a foto deste usuário");
    }

    // Impede alteração da senha
    if (updateData.password && updateData.password !== existingUser.password) {
      throw new Error("Você não tem permissão para mudar a senha deste usuário.");
    }

    // Verifica se o novo email já está cadastrado por outro usuário
    if (updateData.email !== undefined && updateData.email !== null) {
      const userWithEmail = await prisma.user.findUnique({
        where: { email: updateData.email },
      });
      if (userWithEmail && userWithEmail.id !== id) {
        throw new Error("Email já cadastrado");
      }
    }

    // Atualiza os dados do usuário
    const updatedUser = await prisma.user.update({
      data: {
        email: updateData.email,
        name: updateData.name,
        cellphone: updateData.cellphone,
        birth: updateData.birth,
        status: updateData.status,
        role: updateData.role,
      },
      where: { id },
      select: selectItems,
    });

    return updatedUser;
  }

  // Atualiza as informações da conta do próprio usuário, exceto foto, senha, cargo e status
  async updateAccount(id: number, newInfo: Partial<User>) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Impede alteração da foto
    if (newInfo.photo && newInfo.photo !== user.photo) {
      throw new NotAuthorizedError("A foto não pode ser editada por aqui!");
    }

    // Impede alteração da senha por este método
    if (newInfo.password && newInfo.password !== user.password) {
      throw new Error("Não é permitido alterar a senha desta forma");
    }

    // Impede alteração do cargo
    if (newInfo.role && newInfo.role !== user.role) {
      throw new NotAuthorizedError("Não é possível editar o próprio cargo.");
    }

    // Impede alteração do status
    if (newInfo.status && newInfo.status !== user.status) {
      throw new NotAuthorizedError("Não é possível editar o próprio status.");
    }

    // Verifica se o novo email já está cadastrado por outro usuário
    if (newInfo.email !== undefined && newInfo.email !== null) {
      const userByEmail = await prisma.user.findUnique({
        where: { email: newInfo.email },
      });

      if (userByEmail && userByEmail.email !== user.email) {
        throw new Error("Email já cadastrado");
      }
    }

    // Atualiza os dados permitidos do usuário
    const updatedUser = await prisma.user.update({
      data: {
        name: newInfo.name,
        birth: newInfo.birth,
        email: newInfo.email,
        cellphone: newInfo.cellphone,
      },
      where: { id },
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
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Valida a senha antiga
    if (user.password != null) {
      if (!bcrypt.compareSync(oldPassword, user.password)) {
        throw new Error("A senha antiga digitada está errada, tente novamente!");
      }
    }

    // Verifica se a nova senha coincide com a confirmação
    if (newPassword !== confirmPassword) {
      throw new Error("As senhas não são iguais.");
    }

    // Criptografa a nova senha
    const encryptedPassword = await this.encryptPassword(newPassword);

    // Atualiza a senha no banco de dados (atenção: a atualização não utiliza await)
    const updatedUser = prisma.user.update({
      data: {
        password: encryptedPassword,
      },
      where: { id },
    });

    return updatedUser;
  }

  // Atualiza a senha do usuário com nova senha e confirmação
  async updatePassword(id: number, password: string, confirmPassword: string) {
    // Verifica se o usuário existe
    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists) {
      throw new Error("Usuário não encontrado");
    }

    // Verifica se as senhas coincidem
    if (password !== confirmPassword) {
      throw new Error("As senhas não coincidem.");
    }

    // Criptografa a senha e atualiza o usuário
    const encryptedPassword = await this.encryptPassword(password);
    await prisma.user.update({
      data: { password: encryptedPassword },
      where: { id },
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
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new InvalidParamError("Usuário não encontrado");
    }

    // Deleta o usuário
    const deletedUser = await prisma.user.delete({
      where: { id },
    });
    return existingUser;
  }
}

export default new UserService();
