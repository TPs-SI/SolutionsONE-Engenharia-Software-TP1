import { PrismaClient } from "@prisma/client";
import prisma from "../../../../config/prismaClient";
import { Router, Request, Response, NextFunction} from "express";

import UserService from "../service/UserService";
import statusCodes from "../../../../utils/constants/statusCodes";
import { validateEngineerRoute } from "../../../middlewares/engineerValidator";

const userRouter = Router();

/*===== Criação de Conta ===== */

// Rota para registro de novo usuário
userRouter.post("/create", validateEngineerRoute("create"), async (req: Request, res: Response, next: NextFunction) => {
	try {
		const newUser = await UserService.createUser(req.body);
		res.status(statusCodes.CREATED).json(newUser);
	} catch (error) {
		const typedError = error as Error;
		res.status(statusCodes.BAD_REQUEST).json({ error: typedError.message });
		next(error);
	}
});

// Retorna os dados do próprio usuário
userRouter.get("/account", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userAccount = await UserService.readMyUser(req.user.id);
		res.status(statusCodes.SUCCESS).json(userAccount);
	} catch (error) {
		res.status(statusCodes.NOT_FOUND).json({ error: "Erro ao visualizar sua própria conta, tente novamente." });
		next(error);
	}
});

// Atualiza os dados da conta do próprio usuário (exceto foto, senha, cargo e status)
userRouter.put("/account/updateAccount", validateEngineerRoute("update"), async (req: Request, res: Response, next: NextFunction) => {
	try {
		const updateData = req.body;
		const updatedAccount = await UserService.updateAccount(req.user.id, updateData);
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
userRouter.put("/account/updatepasswordAccount", validateEngineerRoute("ResetupdatePassword"), async (req: Request, res: Response, next: NextFunction) => {
	try {
	  	const { oldPassword, newPassword, confirmPassword } = req.body;
	  	const updatedUser = await UserService.updatePasswordAccount(req.user.id, oldPassword, newPassword, confirmPassword);
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
userRouter.put("/account/updatephoto", async (req: Request, res: Response, next: NextFunction) => {
	try {
	  	const updatedUser = await UserService.updatePhotoAccount(req.user.id, req.file);
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
userRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const usersList = await UserService.readAllUsers(req.user.id);
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
userRouter.get("/admin/member/read/:id", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userId = Number(req.params.id);
		const userData = await UserService.readUser(userId);
		res.status(statusCodes.SUCCESS).json(userData);
	} catch (error) {
		const typedError = error as Error;
		res.status(statusCodes.NOT_FOUND).json({ error: typedError.message });
		next(error);
}

export default userRouter;