import { Router, Request, Response, NextFunction } from "express";
import AuthService from "../services/AuthService";
import statusCodes from "../../../../utils/constants/statusCodes";
import { InvalidParamError } from "../../../../errors/InvalidParamError"; 
import { validateEngineerRoute } from "../../../middlewares/engineerValidator"; 

const authRouter = Router();

class AuthController {
    async handleLogin(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(statusCodes.BAD_REQUEST).json({ error: "Email e senha são obrigatórios." });
            }
            const tokenData = await AuthService.login(email, password);
            res.status(statusCodes.SUCCESS).json(tokenData);
        } catch (error) {
            next(error);
        }
    }

    async handleForgotPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;

            if (!email || typeof email !== 'string') {
                return res.status(statusCodes.BAD_REQUEST).json({ error: "Email inválido ou não fornecido." });
            }
            
            await AuthService.createPasswordResetToken(email);
            res.status(statusCodes.SUCCESS).json({ message: "Se o email estiver cadastrado, um link de recuperação foi enviado." });

        } catch (error) {
            next(error);
        }
    }

    async handleResetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.params; 
            const { newPassword, confirmPassword } = req.body;

            if (!token) {
                return res.status(statusCodes.BAD_REQUEST).json({ error: "Token não fornecido na URL." });
            }
            if (!newPassword || !confirmPassword) {
                return res.status(statusCodes.BAD_REQUEST).json({ error: "Nova senha e confirmação são obrigatórias." });
            }
            await AuthService.resetPassword(token, newPassword, confirmPassword);

            res.status(statusCodes.SUCCESS).json({ message: "Senha redefinida com sucesso." });

        } catch (error) {
             next(error);
        }
    }
}

const controller = new AuthController();
authRouter.post("/login", controller.handleLogin);
authRouter.post("/forgot-password", controller.handleForgotPassword);
authRouter.post("/reset-password/:token", controller.handleResetPassword); 

authRouter.post(
    "/reset-password/:token",
    validateEngineerRoute("resetPassword"),
    controller.handleResetPassword
);

export default authRouter;