// UserService.test.ts
import bcrypt from "bcrypt";
import { QueryError } from "../../../../errors/QueryError";
import { NotAuthorizedError } from "../../../../errors/NotAuthorizedError";
import { PermissionError } from "../../../../errors/PermissionError";
import { InvalidParamError } from "../../../../errors/InvalidParamError";

import UserService from "./UserService";
import prisma from "../../../../config/prismaClient";
import { prismaMock } from "../../../../config/singleton";

// Mocks completos para o tipo User do Prisma
const completeUserMock = {
	id: 1,
	email: "teste@teste.com",
	name: "Usuário Teste",
	password: "hashed",
	photo: null,
	key: " ",
	cellphone: "11999999999",
	birth: "1990-01-01",
	status: "Active",
	role: "Member",
	resetToken: null,
	tokenExpires: null,
};

const newUserData = {
	id: 1,
	email: "teste@teste.com",
	name: "Usuário Teste",
	password: "senhaTeste",
	photo: null,
	key: " ",
	cellphone: "11999999999",
	birth: "1990-01-01",
	status: null,
	role: null,
	resetToken: null,
	tokenExpires: null,
};

describe("UserService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("encryptPassword", () => {
		it("deve retornar uma senha criptografada diferente da senha original", async () => {
			const password = "senhaSecreta";
			const encrypted = await UserService.encryptPassword(password);
			expect(encrypted).not.toEqual(password);
			expect(typeof encrypted).toBe("string");
		});
	});

	describe("createUser", () => {
		it("deve lançar QueryError se o email já estiver cadastrado", async () => {
			prismaMock.user.findUnique.mockResolvedValueOnce({
				...completeUserMock,
				id: 2, // outro usuário
				email: "teste@teste.com",
			});
			await expect(UserService.createUser(newUserData)).rejects.toThrow(QueryError);
		});

		it("deve lançar NotAuthorizedError se o usuário fornecer cargo", async () => {
			await expect(UserService.createUser({ ...newUserData, role: "Member" })).rejects.toThrow(NotAuthorizedError);
		});

		it("deve lançar NotAuthorizedError se o usuário fornecer status", async () => {
			await expect(UserService.createUser({ ...newUserData, status: "Active" })).rejects.toThrow(NotAuthorizedError);
		});

		it("deve criar um novo usuário com sucesso", async () => {
			prismaMock.user.findUnique.mockResolvedValueOnce(null);
			jest.spyOn(UserService, "encryptPassword").mockResolvedValueOnce("senhaCriptografada");
			const createdUserMock = {
				id: 1,
				email: "teste@teste.com",
				name: "Usuário Teste",
				password: "senhaCriptografada",
				photo: null,
				key: " ",
				cellphone: "11999999999",
				birth: "1990-01-01",
				status: "Pending",
				role: null,
				resetToken: null,
				tokenExpires: null,
			};
			prismaMock.user.create.mockResolvedValueOnce(createdUserMock);
			const result = await UserService.createUser(newUserData);
			expect(result).toEqual(createdUserMock);
		});
	});

	describe("readUser", () => {
		it("deve retornar o usuário se existir", async () => {
			const userMock = {
				id: 1,
				email: "teste@teste.com",
				name: "Usuário Teste",
				password: "hashed",
				photo: null,
				key: " ",
				cellphone: "1111111111",
				birth: "1990-01-01",
				status: "Active",
				role: "Member",
				resetToken: null,
				tokenExpires: null,
			};
			prismaMock.user.findUnique.mockResolvedValueOnce(userMock);
			const result = await UserService.readUser(1);
			expect(result).toEqual(userMock);
		});

		it("deve lançar QueryError se o usuário não for encontrado", async () => {
			prismaMock.user.findUnique.mockResolvedValueOnce(null);
			await expect(UserService.readUser(1)).rejects.toThrow(QueryError);
		});
	});

	describe("readMyUser", () => {
		it("deve retornar o usuário se existir", async () => {
			const userMock = {
				id: 1,
				email: "teste@teste.com",
				name: "Usuário Teste",
				password: "hashed",
				photo: null,
				key: " ",
				cellphone: "1111111111",
				birth: "1990-01-01",
				status: "Active",
				role: "Member",
				resetToken: null,
				tokenExpires: null,
			};
			prismaMock.user.findUnique.mockResolvedValueOnce(userMock);
			const result = await UserService.readMyUser(1);
			expect(result).toEqual(userMock);
		});

		it("deve lançar QueryError se o usuário não for encontrado", async () => {
			prismaMock.user.findUnique.mockResolvedValueOnce(null);
			await expect(UserService.readMyUser(1)).rejects.toThrow(QueryError);
		});
	});

	describe("readAllUsers", () => {
		it("deve retornar todos os usuários para um solicitante Administrator", async () => {
			prismaMock.user.findUnique.mockResolvedValueOnce({
				...completeUserMock,
				role: "Administrator",
			});
			const usersMock = [
				{
					id: 2,
					name: "Usuário A",
					email: "a@teste.com",
					password: "hashed",
					photo: null,
					key: " ",
					cellphone: "2222222222",
					birth: "1990-01-02",
					status: "Active",
					role: "Member",
					resetToken: null,
					tokenExpires: null,
				},
				{
					id: 3,
					name: "Usuário B",
					email: "b@teste.com",
					password: "hashed",
					photo: null,
					key: " ",
					cellphone: "3333333333",
					birth: "1990-01-03",
					status: "Active",
					role: "Member",
					resetToken: null,
					tokenExpires: null,
				},
			];
			prismaMock.user.findMany.mockResolvedValueOnce(usersMock);
			const result = await UserService.readAllUsers(1);
			expect(result).toEqual(usersMock);
		});

		it("deve lançar QueryError se a lista de usuários estiver vazia para solicitante Administrator", async () => {
			prismaMock.user.findUnique.mockResolvedValueOnce({
				...completeUserMock,
				role: "Administrator",
			});
			prismaMock.user.findMany.mockResolvedValueOnce([]);
			await expect(UserService.readAllUsers(1)).rejects.toThrow(QueryError);
		});

		it("deve retornar os usuários ativos para um solicitante Member", async () => {
			prismaMock.user.findUnique.mockResolvedValueOnce({
				...completeUserMock,
				role: "Member",
			});
			const activeUsersMock = [
				{
					id: 2,
					name: "Usuário A",
					email: "a@teste.com",
					password: "hashed",
					photo: null,
					key: " ",
					cellphone: "2222222222",
					birth: "1990-01-02",
					status: "Active",
					role: "Member",
					resetToken: null,
					tokenExpires: null,
				},
			];
			prismaMock.user.findMany.mockResolvedValueOnce(activeUsersMock);
			const result = await UserService.readAllUsers(1);
			expect(result).toEqual(activeUsersMock);
		});

		it("deve lançar QueryError se nenhum usuário ativo existir para solicitante Member", async () => {
			prismaMock.user.findUnique.mockResolvedValueOnce({
				...completeUserMock,
				role: "Member",
			});
			prismaMock.user.findMany.mockResolvedValueOnce([]);
			await expect(UserService.readAllUsers(1)).rejects.toThrow(QueryError);
		});

		it("deve lançar PermissionError se o solicitante não tiver permissão", async () => {
			prismaMock.user.findUnique.mockResolvedValueOnce({
				...completeUserMock,
				role: "InvalidRole",
			});
			await expect(UserService.readAllUsers(1)).rejects.toThrow(PermissionError);
		});
	});

	describe("updateUserByAdmin", () => {
		const existingUser = {
			id: 1,
			email: "teste@teste.com",
			name: "Usuário Teste",
			photo: "foto.jpg",
			password: "hashed",
			key: " ",
			cellphone: "1111111111",
			birth: "1990-01-01",
			status: "Active",
			role: "Member",
			resetToken: null,
			tokenExpires: null,
		};

		it("deve lançar erro se o usuário não existir", async () => {
			prismaMock.user.findUnique.mockResolvedValueOnce(null);
			await expect(UserService.updateUserByAdmin(1, {})).rejects.toThrow("Usuário não encontrado.");
		});

		it("deve lançar erro para cargo inválido", async () => {
			prismaMock.user.findUnique.mockResolvedValueOnce(existingUser);
			await expect(UserService.updateUserByAdmin(1, { role: "CargoInvalido" })).rejects.toThrow("Cargo inválido");
		});

		it("deve lançar erro para status inválido", async () => {
			prismaMock.user.findUnique.mockResolvedValueOnce(existingUser);
			await expect(UserService.updateUserByAdmin(1, { status: "StatusInvalido" })).rejects.toThrow("Status inválido");
		});

		it("deve lançar erro ao tentar alterar a foto", async () => {
			prismaMock.user.findUnique.mockResolvedValueOnce(existingUser);
			await expect(UserService.updateUserByAdmin(1, { photo: "novaFoto.jpg" })).rejects.toThrow("Você não tem permissão para alterar a foto deste usuário");
		});

		it("deve lançar erro ao tentar alterar a senha", async () => {
			prismaMock.user.findUnique.mockResolvedValueOnce(existingUser);
			await expect(UserService.updateUserByAdmin(1, { password: "novaSenha" })).rejects.toThrow("Você não tem permissão para mudar a senha deste usuário.");
		});

		it("deve lançar erro se o novo email já estiver cadastrado por outro usuário", async () => {
			prismaMock.user.findUnique
				.mockResolvedValueOnce(existingUser) // verifica existência do usuário a ser atualizado
				.mockResolvedValueOnce({
					...completeUserMock,
					id: 2,
					email: "novoemail@teste.com",
				}); // email em uso por outro
			await expect(UserService.updateUserByAdmin(1, { email: "novoemail@teste.com" })).rejects.toThrow("Email já cadastrado");
		});

		it("deve atualizar e retornar o usuário", async () => {
			prismaMock.user.findUnique.mockResolvedValueOnce(existingUser);
			prismaMock.user.findUnique.mockResolvedValueOnce(null); // verificação de email
			const updatedUserMock = { ...existingUser, name: "Usuário Atualizado" };
			prismaMock.user.update.mockResolvedValueOnce(updatedUserMock);
			const result = await UserService.updateUserByAdmin(1, { name: "Usuário Atualizado" });
			expect(result).toEqual(updatedUserMock);
		});
	});

	describe("updateAccount", () => {
		const user = {
			id: 1,
			email: "teste@teste.com",
			name: "Usuário Teste",
			photo: "foto.jpg",
			password: "hashed",
			role: "Member",
			status: "Active",
			key: " ",
			cellphone: "1111111111",
			birth: "1990-01-01",
			resetToken: null,
			tokenExpires: null,
		};

		it("deve lançar erro se o usuário não for encontrado", async () => {
			prismaMock.user.findUnique.mockResolvedValueOnce(null);
			await expect(UserService.updateAccount(1, {})).rejects.toThrow("Usuário não encontrado");
		});

		it("deve lançar NotAuthorizedError se tentar alterar a foto", async () => {
			prismaMock.user.findUnique.mockResolvedValueOnce(user);
			await expect(UserService.updateAccount(1, { photo: "novaFoto.jpg" })).rejects.toThrow("A foto não pode ser editada por aqui!");
		});

		it("deve lançar erro se tentar alterar a senha", async () => {
			prismaMock.user.findUnique.mockResolvedValueOnce(user);
			await expect(UserService.updateAccount(1, { password: "novaSenha" })).rejects.toThrow("Não é permitido alterar a senha desta forma");
		});

		it("deve lançar NotAuthorizedError se tentar alterar o cargo", async () => {
			prismaMock.user.findUnique.mockResolvedValueOnce(user);
			await expect(UserService.updateAccount(1, { role: "Administrator" })).rejects.toThrow("Não é possível editar o próprio cargo.");
		});

		it("deve lançar NotAuthorizedError se tentar alterar o status", async () => {
			prismaMock.user.findUnique.mockResolvedValueOnce(user);
			await expect(UserService.updateAccount(1, { status: "Pending" })).rejects.toThrow("Não é possível editar o próprio status.");
		});

		it("deve lançar erro se o novo email já estiver em uso por outro usuário", async () => {
			prismaMock.user.findUnique.mockResolvedValueOnce(user); // usuário atual
			prismaMock.user.findUnique.mockResolvedValueOnce({
				...completeUserMock,
				id: 2,
				email: "outro@teste.com",
			}); // conflito de email
			await expect(UserService.updateAccount(1, { email: "outro@teste.com" })).rejects.toThrow("Email já cadastrado");
		});

		it("deve atualizar e retornar o usuário", async () => {
			prismaMock.user.findUnique.mockResolvedValueOnce(user); // usuário atual
			prismaMock.user.findUnique.mockResolvedValueOnce(null); // verificação de email
			const updatedUserMock = { ...user, name: "Nome Novo", email: "novo@teste.com" };
			prismaMock.user.update.mockResolvedValueOnce(updatedUserMock);
			const result = await UserService.updateAccount(1, { name: "Nome Novo", email: "novo@teste.com" });
			expect(result).toEqual(updatedUserMock);
		});
	});


});