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



});