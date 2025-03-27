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

export default userRouter;