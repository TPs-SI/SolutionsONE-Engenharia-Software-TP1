import { PrismaClient } from "@prisma/client";
import prisma from "../../../../config/prismaClient";
import { Router, Request, Response, NextFunction} from "express";

import UserService from "../service/UserService";
import statusCodes from "../../../../utils/constants/statusCodes";

const UserRouter = Router();

export default UserRouter;