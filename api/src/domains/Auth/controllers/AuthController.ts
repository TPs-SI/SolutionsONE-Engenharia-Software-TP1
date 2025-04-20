import { Router, Request, Response, NextFunction } from "express";
import AuthService from "../services/AuthService";
import statusCodes from "../../../../utils/constants/statusCodes";

const authRouter = Router();

class AuthController {
    // Handler para a rota de login
    async handleLogin(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(statusCodes.BAD_REQUEST).json({ error: "Email e senha são obrigatórios." });
            }
            const validatedUser = await AuthService.validateUserCredentials(email, password);

            res.status(statusCodes.SUCCESS).json(validatedUser);

        } catch (error) {
            next(error);
        }
    }
}

const controller = new AuthController();

authRouter.post("/login", controller.handleLogin);

export default authRouter;