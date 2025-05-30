import { PrismaClient } from "@prisma/client";
import prisma from "../../../../config/prismaClient";
import { Router, Request, Response, NextFunction } from "express";

import UserService from "../service/UserService";
import statusCodes from "../../../../utils/constants/statusCodes";
import { validateEngineerRoute } from "../../../middlewares/engineerValidator";
import authMiddleware from "../../../middlewares/auth";
import { LoginError } from "../../../../errors/LoginError";
import { authorizeRoles } from "../../../middlewares/authorizeRoles";
import { UserRole } from "../types/UserRole";

const userRouter = Router();

/*===== Criação de Conta ===== */

// Rota para registro de novo usuário
userRouter.post(
	"/create",
	authMiddleware,
	authorizeRoles([UserRole.ADMIN]),
	validateEngineerRoute("create"),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const newUser = await UserService.createUser(req.body);
			res.status(statusCodes.CREATED).json(newUser);
		} catch (error) {
			const typedError = error as Error;
			res.status(statusCodes.BAD_REQUEST).json({ error: typedError.message });
			next(error);
		}
	});

/*===== Rotas que Exigem Autenticação ===== */

// Retorna os dados do próprio usuário
userRouter.get(
	"/account",
	authMiddleware,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			if (!req.user) {
				return next(new LoginError("Usuário não autenticado."));
			}
			const userAccount = await UserService.readMyUser(req.user.userId);
			res.status(statusCodes.SUCCESS).json(userAccount);
		} catch (error) {
			next(error);
		}
	});

// Atualiza os dados da conta do próprio usuário (exceto foto, senha, cargo e status)
userRouter.put(
	"/account/updateAccount",
	authMiddleware,
	validateEngineerRoute("update"),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			// @ts-ignore 
			if (!req.user) {
				return next(new LoginError("Usuário não autenticado."));
			}

			// @ts-ignore 
			const updateData = req.body;
			const updatedAccount = await UserService.updateAccount(req.user.userId, updateData);
			if (updatedAccount) {
				res.status(statusCodes.SUCCESS).json(updatedAccount);
			} else {
				res.status(statusCodes.NOT_FOUND).send();
			}
		} catch (error) {
			next(error);
		}
	});

// Atualiza a senha da conta do próprio usuário após validar a senha antiga e a confirmação
userRouter.put(
    "/account/updatepasswordAccount",
    authMiddleware,
    validateEngineerRoute("updateAccountPassword"), 
    async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { oldPassword, newPassword, confirmPassword } = req.body;
		// @ts-ignore 
		if (!req.user) {
			return next(new LoginError("Usuário não autenticado."));
		}
		// @ts-ignore 
		const updatedUser = await UserService.updatePasswordAccount(req.user.userId, oldPassword, newPassword, confirmPassword);
		if (updatedUser) {
			res.status(statusCodes.SUCCESS).json({ message: "Senha redefinida com sucesso" });
		} else {
			res.status(statusCodes.NOT_FOUND).send();
		}
	} catch (error) {
		next(error);
	}
});

// Atualiza a foto de perfil do usuário
userRouter.put(
    "/account/updatephoto",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
	try {
		// @ts-ignore 
		if (!req.user) {
			return next(new LoginError("Usuário não autenticado."));
		}
		// @ts-ignore 
		const updatedUser = await UserService.updatePhotoAccount(req.user.userId, req.file);
		if (updatedUser) {
			res.status(statusCodes.SUCCESS).json(updatedUser);
		} else {
			res.status(statusCodes.BAD_REQUEST).json("Erro ao salvar imagem em cache.");
		}
	} catch (error) {
		next(error);
	}
});

/*
 * ===== Rotas Administrativas =====
 */

// Retorna a lista de usuários de acordo com o cargo do solicitante
userRouter.get(
    "/",
    authMiddleware,
    authorizeRoles([UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER]),
    async (req: Request, res: Response, next: NextFunction) => {
	try {
		// @ts-ignore 
		if (!req.user) {
			return next(new LoginError("Usuário não autenticado."));
		}
		// @ts-ignore 
		const usersList = await UserService.readAllUsers(req.user.role);
		if (usersList) {
			res.status(statusCodes.SUCCESS).json(usersList);
		} else {
			res.status(statusCodes.NOT_FOUND).json({ error: "Nenhum usuário ativo." });
		}
	} catch (error) {
		const typedError = error as Error;
		res.status(statusCodes.NOT_FOUND).json({ error: typedError.message });
		next(error);
	}
});

// Retorna os dados de um usuário específico (acesso para Administrador e Member)
userRouter.get(
    "/admin/member/read/:id",
    authMiddleware,
    authorizeRoles([UserRole.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userId = Number(req.params.id);
		const userData = await UserService.readUser(userId);
		res.status(statusCodes.SUCCESS).json(userData);
	} catch (error) {
		const typedError = error as Error;
		res.status(statusCodes.NOT_FOUND).json({ error: typedError.message });
		next(error);
	}
});

// Permite que o administrador atualize as informações de um usuário
userRouter.put(
    "/admin/update/:id",
    authMiddleware,
    authorizeRoles([UserRole.ADMIN]),
    validateEngineerRoute("update"),
    async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const updateData = req.body;
		const updatedUser = await UserService.updateUserByAdmin(Number(id), updateData);
		res.status(statusCodes.SUCCESS).json({ message: "Alterações salvas com sucesso", user: updatedUser });
	} catch (error) {
		const typedError = error as Error;
		res.status(statusCodes.FORBIDDEN).json({ error: typedError.message });
		next(error);
	}
});

// Permite que o administrador atualize a senha de um usuário
userRouter.put(
    "/admin/update/password/:id",
    authMiddleware,
    authorizeRoles([UserRole.ADMIN]),
	validateEngineerRoute("adminUpdatePassword"),
    async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const { password, confirmPassword } = req.body;
		const updatedPassword = await UserService.updatePassword(Number(id), password, confirmPassword);
		res.status(statusCodes.SUCCESS).json({ message: "Senha alterada com sucesso", password: updatedPassword });
	} catch (error) {
		const typedError = error as Error;
		res.status(statusCodes.NOT_FOUND).json({ error: typedError.message });
		next(error);
	}
});

// Permite que o administrador delete um usuário
userRouter.delete(
    "/admin/remove/:id",
    authMiddleware,
    authorizeRoles([UserRole.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const deletedUser = await UserService.deleteUser(Number(id));
		res.status(statusCodes.SUCCESS).json({ message: "Usuário deletado com sucesso", user: deletedUser });
	} catch (error) {
		const typedError = error as Error;
		res.status(statusCodes.NOT_FOUND).json({ error: typedError.message });
		next(error);
	}
});

export default userRouter;