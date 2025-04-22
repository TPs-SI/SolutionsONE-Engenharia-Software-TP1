import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import express, { Express } from "express";
import errorHandler from '../src/middlewares/erroHandler';
import cookieParser from "cookie-parser";

import userRouter from "../src/domains/User/controllers/UserController";
import projectRouter from "../src/domains/Project/controllers/ProjectController";
import authRouter from "../src/domains/Auth/controllers/AuthController";

dotenv.config();

export const app: Express = express();
const options: CorsOptions = {
	credentials: true,
	origin: process.env.APP_URL,
};

app.use(cors(options));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
	extended: true,
}));

// Aqui ficarão as rotas
app.use("/api/users", userRouter);
app.use("/api/projects", projectRouter);
app.use("/api/auth", authRouter);

app.use(errorHandler);

export default app;
