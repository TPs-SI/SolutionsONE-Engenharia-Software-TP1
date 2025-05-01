import { Router, Request, Response, NextFunction } from "express";
import ContractService from "../service/ContractService";
import statusCodes from "../../../../utils/constants/statusCodes";
import { validateEngineerRoute } from "../../../middlewares/engineerValidator";
import authMiddleware from "../../../middlewares/auth";


const ContractRouter = Router();
ContractRouter.post("/create",authMiddleware, validateEngineerRoute("createContract"),async(req: Request, res: Response, next: NextFunction)=>{
    try{
        const contract = await ContractService.createContract(req.body);
        res.status(statusCodes.SUCCESS).json(contract);
    } catch(error){
        const typedError = error as Error;
        res.status(statusCodes.NOT_FOUND).json({ error: typedError.message});;
        next(error)
    }
})

ContractRouter.get("/read/:id", authMiddleware,async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const readContract = await ContractService.readContract(Number(req.params.id));
        res.status(statusCodes.SUCCESS).json(readContract);
    } catch (error) {
        const typedError = error as Error;
        res.status(statusCodes.NOT_FOUND).json({ error: typedError.message});
        next (error);    
    }

});

ContractRouter.put("/update/:id",authMiddleware, validateEngineerRoute("updateContract"),async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const updateContract = await ContractService.updateContract(Number(req.params.id),req.body)
        res.status(statusCodes.SUCCESS).json(updateContract);
    } catch (error) {
        const typedError = error as Error;
        res.status(statusCodes.NOT_FOUND).json({ error: typedError.message});
        next (error);    
    }

});

ContractRouter.delete("/remove/:id",authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {

        const contract = await ContractService.deleteContract(Number(req.params.id));
        res.status(statusCodes.SUCCESS).json({message: 'Contrato deletado com sucesso!', contract});
    } catch (error) {
        const typedError = error as Error;
        res.status(statusCodes.NOT_FOUND).json({ error: typedError.message});
        next (error);
    }
});

ContractRouter.get("/", authMiddleware,async (req: Request, res: Response, next: NextFunction) => {
    try {
        const listContracts = await ContractService.listContracts();
        res.status(statusCodes.SUCCESS).json(listContracts);
    } catch (error) {
        const typedError = error as Error;
        res.status(statusCodes.NOT_FOUND).json({ error: typedError.message});
        next (error);
    }
});
export default ContractRouter;