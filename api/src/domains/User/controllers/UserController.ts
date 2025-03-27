import { PrismaClient } from "@prisma/client";
import prisma from "../../../../config/prismaClient";
import { Router, Request, Response, NextFunction} from "express";

import UserService from "../service/UserService";
import statusCodes from "../../../../utils/constants/statusCodes";
import { validateEngineerRoute } from "../../../middlewares/engineerValidator";

const UserRouter = Router();

/*===== Criação de Conta ===== */



export default UserRouter;