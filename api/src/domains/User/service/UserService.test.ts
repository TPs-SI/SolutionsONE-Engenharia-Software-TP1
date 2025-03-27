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


});