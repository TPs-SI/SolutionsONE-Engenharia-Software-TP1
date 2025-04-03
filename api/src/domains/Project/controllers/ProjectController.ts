import { Router, Request, Response, NextFunction } from "express";
import ProjectService from "../service/ProjectService";
import { validateEngineerRoute } from "../../../middlewares/engineerValidator";
import statusCodes from "../../../../utils/constants/statusCodes";

const ProjectRouter = Router();

ProjectRouter.get("/", async (req: Request, res: Response, next:NextFunction) =>{
    try {
        const read_projects = await ProjectService.read_allProjects();
        res.status(statusCodes.SUCCESS).json(read_projects);
    } catch (error) {
        const typedError = error as Error;
        res.status(statusCodes.NOT_FOUND).json({ error: typedError.message});
        next (error);    
    }
})

ProjectRouter.post("/create", validateEngineerRoute("createProject"), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createProject = await ProjectService.createProject(req.body);
        res.status(statusCodes.CREATED).json(createProject);
    } catch (error) {
        const typedError = error as Error;
        res.status(statusCodes.BAD_REQUEST).json({ error: typedError.message});
        next (error);
    }
})


ProjectRouter.delete("/remove/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const project = await ProjectService.deleteProject(Number(id));
        res.status(statusCodes.SUCCESS).json({message: 'Projeto deletado com sucesso', project});
    } catch (error) {
        const typedError = error as Error;
        res.status(statusCodes.NOT_FOUND).json({ error: typedError.message});
        next (error);
    }
});

ProjectRouter.put("/update/:id", validateEngineerRoute("updateProject"), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const updatedProject = await ProjectService.updateProject(Number(id), req.body);
        res.status(statusCodes.SUCCESS).json(updatedProject);
    } catch (error) {
        const typedError = error as Error;
        res.status(statusCodes.BAD_REQUEST).json({ error: typedError.message });
        next(error);
    }
});

ProjectRouter.get("/read/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
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
