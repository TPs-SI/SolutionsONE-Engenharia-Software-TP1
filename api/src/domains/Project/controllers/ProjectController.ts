import { Router, Request, Response, NextFunction } from "express";
import ProjectService from "../service/ProjectService";
import statusCodes from "../../../../utils/constants/statusCodes";
import authMiddleware from "../../../middlewares/auth";
import { authorizeRoles } from "../../../middlewares/authorizeRoles"; 
import { UserRole } from "../../User/types/UserRole";      
import { LoginError } from "../../../../errors/LoginError";
import { validateEngineerRoute } from "../../../middlewares/engineerValidator";

const ProjectRouter = Router();

ProjectRouter.get(
    "/",
    authMiddleware,
    async (req: Request, res: Response, next:NextFunction) =>{
    try {
        // @ts-ignore 
        if (!req.user) return next(new LoginError("Usuário não autenticado."));
        const read_projects = await ProjectService.read_allProjects();
        res.status(statusCodes.SUCCESS).json(read_projects);
    } catch (error) {
        next (error);    
    }
})

ProjectRouter.post(
    "/create",
    authMiddleware,
    authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]), 
    validateEngineerRoute("createProject"),
    async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore 
        if (!req.user) return next(new LoginError("Usuário não autenticado."));
        const createProject = await ProjectService.createProject(req.body);
        res.status(statusCodes.CREATED).json(createProject);
    } catch (error) {
        next (error);
    }
})

ProjectRouter.delete(
    "/:id", 
    authMiddleware,
    authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]),
    async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore 
        if (!req.user) return next(new LoginError("Usuário não autenticado."));
        const { id } = req.params;
        const project = await ProjectService.deleteProject(Number(id));
        res.status(statusCodes.SUCCESS).json({message: 'Projeto deletado com sucesso', project});
    } catch (error) {
        next (error);
    }
});

ProjectRouter.put(
    "/update/:id",
    authMiddleware,
    authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]),
    validateEngineerRoute("updateProject"),
    async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore 
        if (!req.user) return next(new LoginError("Usuário não autenticado."));
        const { id } = req.params;
        const updatedProject = await ProjectService.updateProject(Number(id), req.body);
        res.status(statusCodes.SUCCESS).json(updatedProject);
    } catch (error) {
        const typedError = error as Error;
        res.status(statusCodes.BAD_REQUEST).json({ error: typedError.message });
        next(error);
    }
});

ProjectRouter.get(
    "/read/:id",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore 
        if (!req.user) return next(new LoginError("Usuário não autenticado."));
        const { id } = req.params;
        const project = await ProjectService.readById(Number(id));
        res.status(statusCodes.SUCCESS).json(project);
    } catch (error) {
        const typedError = error as Error;
        res.status(statusCodes.NOT_FOUND).json({ error: typedError.message });
        next(error);
    }
});

export default ProjectRouter;
