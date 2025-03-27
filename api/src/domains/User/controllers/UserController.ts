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

export default userRouter;