import { Contract } from "@prisma/client";
import prisma from "../../../../config/prismaClient";
import { QueryError } from"../../../../errors/QueryError";
import { convertDocxToPdf, docxSubs, transformarData } from "../../../../utils/functions/docxFunctions";
import { DeletarContratoDaAWS } from "../../../middlewares/multerContract";
import { PermissionError } from "../../../../errors/PermissionError";



class ContractService {

    async createContract(body: Contract){

        if (body.archivePath != null && body.archivePath != ".../.../.../.../utils/contract"){
            throw new PermissionError("O archivePath não pode ser diferente de '.../.../.../.../utils/contract' ou de nulo!");
        }
        const contract = await prisma.contract.create({
            data: {
                title: body.title,
                nameClient: body.nameClient,
                value: body.value,
                date: body.date,

                archivePath: ".../.../.../.../utils/contract"
            }
        })


        // const newData = transformarData(body.date);
        // const dia = newData.dia;
        // const mes = newData.mes;
        // const ano = newData.ano;

        // const newDoc = await docxSubs(contract, dia, mes, ano);
        // const newPdf = await convertDocxToPdf(newDoc,contract.id);

        // const newcontract = await prisma.contract.update({
        //     where:{
        //         id:contract.id,
        //     },
        //     data:{
        //         key: newPdf,
        //     } 
        // });
        
        
        return contract;
    }

    async readContract(id: number) {
        const contract = await prisma.contract.findUnique({
            where: {id: id},
        });

        if(!contract){
            throw new QueryError("Id de contrato inserido inválido!");
        }

        return contract;
    }

    async updateContract(id: number, body: Contract){
        let date;
        let title;
        let value;
        let nameClient;
        let archivePath;
        const contract = await prisma.contract.findUnique({
            where: { 
                id: id 
            },
        });
        if(!contract){
            throw new QueryError("Id de contrato inserido inválido!");
        }

        if(body.title != null){
            title = body.title;
        }
        else{
            title = contract.title;
        }

        if(body.date != null){
            date = body.date;
        }
        else{
            date = contract.date;
        }

        if(body.value != null){
            value = body.value;
        }
        else{
            value = contract.value;
        }

        if(body.nameClient != null){
            nameClient = body.nameClient;
        }
        else{
            nameClient = contract.nameClient;
        }

        if(body.archivePath != null){
            archivePath = body.archivePath;
        }
        else{
            archivePath = contract.archivePath;
        }

        const updateContract = await prisma.contract.update({
            data:{
                nameClient: nameClient,
                value: value,
                title: title,
                date: date,
                archivePath: archivePath
            },
            where:{
                id: id
            }
        });

        // const newData = transformarData(date);
        // const dia = newData.dia;
        // const mes = newData.mes;
        // const ano = newData.ano;

        // const newDoc = await docxSubs(updateContract, dia, mes, ano);
        // const newPdf = await convertDocxToPdf(newDoc,updateContract.id);

        // const newcontract = await prisma.contract.update({
        //     where:{
        //         id: updateContract.id,
        //     },
        //     data:{
        //         key: newPdf,
        //     } 
        // });
        
        
        return contract;

    }

    async deleteContract(id: number){
        const contract = await prisma.contract.findUnique({
            where: { id: id },
        });
        if(!contract){
            throw new QueryError("Id de contrato inserido inválido!");
        }
    
        await prisma.contract.delete({
            where: {
                id: id
            }          
        });
        return contract;
}
    
 
    async listContracts() {
        const contracts = await prisma.contract.findMany({
            orderBy: {
                title: 'asc'
            }
        });

        if (contracts.length === 0) {
            throw new QueryError("Nenhum contrato encontrado!");
        }

        return contracts;
}




}
export default new ContractService();