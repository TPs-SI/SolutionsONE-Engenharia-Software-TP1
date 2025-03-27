import { User } from "@prisma/client";
import prisma from "../../../../config/prismaClient";
import { selectItems, selectItems2 } from "./excludeAttributes";

import bcrypt from "bcrypt";
import crypto from "crypto";

import { InvalidParamError } from "../../../../errors/InvalidParamError";
import { NotAuthorizedError } from "../../../../errors/NotAuthorizedError";
import { PermissionError } from "../../../../errors/PermissionError";
import { QueryError } from "../../../../errors/QueryError";

// Cargos e status válidos
const validRoles = ["Manager", "Administrator", "Member"];
const validStatus = ["Pending", "Active"];

class UserService {
	// Função para criptografar a senha usando bcrypt
	async encryptPassword(password: string) {
		const saltRounds = 10;
		const encrypted = await bcrypt.hash(password, saltRounds);
		return encrypted;
	}

	// Cria um novo usuário após verificar restrições e criptografar a senha
	async createUser(body: User) {
		const checkUser = await prisma.user.findUnique({
			where: { email: body.email },
		});

		if (checkUser) {
			throw new QueryError("Esse email já esta cadastrado.");
		}

		if (body.role != null) {
			throw new NotAuthorizedError("Não é possível inserir o próprio cargo.");
		}

		if (body.status != null) {
			throw new NotAuthorizedError("Não é possível inserir o próprio status.");
		}

		if (body.password != null) {
			const encrypted = await this.encryptPassword(body.password);

			const user = await prisma.user.create({
				data: {
					id: body.id,
					email: body.email,
					name: body.name,
					password: encrypted,
					key: " ",
					cellphone: body.cellphone,
					birth: body.birth,
					status: "Pending",
					role: null,
					resetToken: null,
					tokenExpires: null,
				},
				select: selectItems,
			});

			return user;
		}
	}

	// Retorna um usuário específico pelo ID
	async readUser(id: number) {
		const user = await prisma.user.findUnique({
			where: { id: id },
			select: selectItems,
		});

		if (!user) {
			throw new QueryError("Id de usuário inexistente e/ou inválido");
		}

		return user;
	}

	// Retorna todos os usuários conforme o cargo do solicitante
	async read_AllUser(id: number) {
		const account = await prisma.user.findUnique({
			where: { id },
		});

		if (account?.role == "Administrator" || account?.role == "Manager") {
			const user = await prisma.user.findMany({
				orderBy: { name: "asc" },
				select: selectItems,
			});

			if (user && user.length > 0) {
				return user;
			} else {
				throw new QueryError("A lista de usuários está vazia.");
			}
		} else if (account?.role == "Member") {
			const wanteds = await prisma.user.findMany({
				where: { status: "Active" },
				select: selectItems,
			});

			if (wanteds && wanteds.length > 0) {
				return wanteds;
			} else {
				throw new QueryError("Nenhum usuário está ativo");
			}
		} else {
			throw new PermissionError("Você não tem o cargo necessário para visualizar os usuários");
		}
	}

	// Permite que o admin atualize as informações de um usuário
	async updateUserbyAdmin(id: number, body: Partial<User>) {
        // Verifica se o usuário existe
        const user2 = await prisma.user.findUnique({
            where: { id },
        });

        if (!user2) {
            throw new Error('Usuário não encontrado.');
        }

        if(body.role !== undefined && body.role !== null) {
            // Verifica se o role é válido
            if(!validRoles.includes(body.role)) {
                throw new Error("Cargo inválido");
            }
        }

        if(body.status !== undefined && body.status !== null) {
            // Verifica se o status é válido
            if(!validStatus.includes(body.status)) {
                throw new Error("Status inválido");
            }
        }

        // Verifica se o usuário está tentando alterar a foto
        if(body.photo && body.photo !== user2.photo){
            throw new Error("Você não tem permissão para alterar a foto deste usuári.o");
        }

        // Verifica se o usuário está tentando alterar a senha
        if(body.password && body.password !== user2.password){
            throw new Error("Você não tem permissão para realizar mudar a senha deste usuário.");
        }

        if(body.email !== undefined && body.email !== null) {
            //	Verifica se o email já existe
            const existingEmail=await prisma.user.findUnique({where: {email: body.email}})
            if(existingEmail && existingEmail.id != id) {
                throw new Error("Email já cadastrado");
            }
        }

        // Atualiza os dados do usuário
        const user  = await prisma.user.update({
            data: {
                email: body.email,
                name: body.name,
                cellphone: body.cellphone,
                birth: body.birth,
                status: body.status,
                role: body.role,    
            },
            where: {
                id:id,
            },
            select: selectItems
        });

    return user;  
    }

		// Atualiza os dados da conta do usuário, com validações para impedir alterações não autorizadas
	async UpdateAccount(id: number, newinfos: Partial<User>) {
		const user = await prisma.user.findUnique({
			where: { id }
		});

		if (!user) {
			throw new Error("Usuário não encontrado");
		}

		// Impede alteração da senha por esse método
		if (newinfos.password && newinfos.password !== user.password) {
			throw new Error("Não é permitido alterar a senha desta forma");
		}

		// Impede alteração do cargo
		if (newinfos.role && newinfos.role !== user.role) {
			throw new NotAuthorizedError("Não é possível editar o próprio cargo.");
		}

		// Impede alteração do status
		if (newinfos.status && newinfos.status !== user.status) {
			throw new NotAuthorizedError("Não é possível editar o próprio status.");
		}

		// Verifica se o novo email já está cadastrado por outro usuário
		if (newinfos.email !== undefined && newinfos.email !== null) {
			const userEmail = await prisma.user.findUnique({
				where: { email: newinfos.email }
			});

			if (userEmail && userEmail.email !== user.email) {
				throw new Error("Email já cadastrado");
			}
		}

		// Atualiza os dados permitidos
		const updatedUser = await prisma.user.update({
			data: {
				name: newinfos.name,
				birth: newinfos.birth,
				email: newinfos.email,
				cellphone: newinfos.cellphone
			},
			where: { id },
			select: selectItems
		});

		return updatedUser;
	}

	// Atualiza a senha do usuário após validações de senha antiga e confirmação
	async UpdatePasswordAccount(id: number, oldpassword: string, newPassword: string, confirmpassword: string) {
		const user = await prisma.user.findUnique({
			where: { id }
		});

		if (!user) {
			throw new Error("Usuário não encontrado");
		}

		// Valida se a senha antiga está correta
		if (user.password != null) {
			if (!bcrypt.compareSync(oldpassword, user.password)) {
				throw new Error("A senha antiga digitada está errada, tente novamente!");
			}
		}

		// Verifica se nova senha e confirmação coincidem
		if (newPassword !== confirmpassword) {
			throw new Error("As senhas não são iguais.");
		}

		// Criptografa nova senha
		const passaword_encrypted = await this.encryptPassword(newPassword);

		// Atualiza senha no banco de dados
		const newuser = prisma.user.update({
			data: {
				password: passaword_encrypted
			},
			where: {
				id
			}
		});

		return newuser;
	}

	async updatePassword(id: number,  password:string, confirmpassword:string) {
        // Verifica se o usuário existe
        if(!(await prisma.user.findUnique({where: {id}}))) {
            throw new Error("Usuário não encontrado");
        }
        
        // Verifica se as senhas são iguais
        if(password !== confirmpassword){
            throw new Error("As senhas não coincidem.");
        }
        
        // Atualiza a senha do usuário
        const encrypted = await this.encryptPassword(password);
        const user = await prisma.user.update({
			data: {
				password: encrypted
			},
			where: {
				id: id,
			}
        });
        return password;
    }

    async deleteUser(id: number) {
        // Verifica se o usuário existe
        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        });

        if(!user) {
            throw new InvalidParamError("Usuário não encontrado");
        }

        // Deleta o usuário
        const deleteuser = await prisma.user.delete({
            where: {id}
        });
    	return user;
	}

	// Retornar informações do próprio usuário 
	async readMyUser(id: number) {
		const user = await prisma.user.findUnique({
			where: {id: id},
			select: selectItems2
		});
	
		if(!user){
			throw new QueryError("Usuário invalido ou inexistente.");
		}
	
		return user;
	}

}

export default new UserService();
