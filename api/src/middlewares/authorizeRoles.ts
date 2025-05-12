import { Request, Response, NextFunction } from "express";
import { PermissionError } from "../../errors/PermissionError";
import { UserRole } from "../domains/User/types/UserRole";

export const authorizeRoles = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !user.role) {
      return next(new PermissionError("Autenticação necessária, mas informações de usuário ausentes."));
    }

    if (!allowedRoles.includes(user.role as UserRole)) {
      return next(new PermissionError("Você não tem permissão para acessar este recurso."));
    }

    next();
  };
};
