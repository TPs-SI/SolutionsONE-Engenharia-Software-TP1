import { Prisma, Project, UsersProjects } from "@prisma/client";
import prisma from "../../../../config/prismaClient";
import { QueryError } from "../../../../errors/QueryError";

interface userProjectData { 
    id: number; 
    name: string; 
    contractId: number; 
    date?: string; 
    team?: {
        userId: number;
        function: string;
    }[]; 
  }

  interface ProjectService { 
    id: number; 
    name?: string; 
    contractId?: number; 
    date?: string; 
    team?: {
        userId: number;
        function: string;
    }[]; 
}

class ProjectService {

    async createProject(body: userProjectData) {

        const checkContract = await prisma.contract.findUnique({
            where: {
                id: body.contractId
            }
        });
        if (!checkContract){
            throw new QueryError("Contrato inexistente!");
        }
        
        const checkProject = await prisma.project.findUnique({
            where: {
                contractId: body.contractId
            }
        });
        if (checkProject){
            throw new QueryError("Esse contrato pertence à outro projeto.");
        }

        if ( body.team == null || body.team.length === 0 || body.team == undefined) {
            throw new QueryError("É necessário associar, pelo menos, um usuário ao projeto.");
        }
        if (!body.team.every(userProject => userProject.userId)) {
            throw new QueryError("Todos os projetos devem ter um usuário associado.");
        }

        if (!body.team.every(userProject => userProject.function)) {
            throw new QueryError("Todos os usuários devem ter uma função associada no projeto.");
        }
        
        const userIds = body.team.map(userProject => userProject.userId);
        const existingUsers = await prisma.user.findMany({
            where: {
                id: {
                    in: userIds
                }
            }
        });
        
        const existingUserIds = new Set(existingUsers.map(user => user.id));
        
        if (!userIds.every(id => existingUserIds.has(id))) {
            throw new QueryError("Um ou mais usuários fornecidos não existem.");
        }



        const userIdDuplicate = new Set();
        for (const userProject of body.team) {
            if (userIdDuplicate.has(userProject.userId)) {
                throw new QueryError("Existem usuários duplicados no projeto.");
            }
            userIdDuplicate.add(userProject.userId);
        }


        const project = await prisma.project.create({
            data: {
                name: body.name,
                contractId: body.contractId,
                date: body.date,
            }
        });


        await prisma.usersProjects.createMany({
            data: body.team.map(userProject => ({
                userId: userProject.userId,
                projectId: project.id,  
                function: userProject.function
            }))
        });

        return {
            ...project,
            team: body.team
        };
    }



    async deleteProject(id: number) {

        const check = await prisma.project.findUnique({
            where: {
                id: id
            }
        })
        if(!check){
            throw new QueryError("Projeto inexistente.");
        }

        await prisma.usersProjects.deleteMany({
            where: { projectId: id },
        });

        const deleteProject = await prisma.project.delete({
            where: {
                id: id
            }
        })

    return check;
    }



    async read_allProjects(){
        const projects = await prisma.project.findMany({
            orderBy: {
				name:"asc"
			},
        });

        if(projects.length === 0){
            throw new QueryError("Não existe nenhum projeto cadastrado");
        };

        return projects;
    }






    // Função para leitura de projeto por ID
    async readById(id: number) {
    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            team: { 
                include: {
                    users: true, 
                }
            },
            contract: true 
        }
    });
    
        if (!project) {
            throw new QueryError("Projeto inexistente.");
        }
    
        return {
            ...project,
            team: project.team.map(up => ({
                userId: up.userId,
                function: up.function,
                user: up.users 
            }))
        };
    }




    // Função para atualização do projeto
    async updateProject(id: number, body: Partial<ProjectService>) {
        // Verifica se o projeto existe
        const checkProject = await prisma.project.findUnique({
            where: { id },
            include: {
                team: true, 
            }
        });
        
        if (!checkProject) {
            throw new QueryError("Projeto inexistente.");
        }
    
        const teamToUpdate = body.team !== undefined && body.team !== null ? body.team : checkProject.team;
    
        if (body.contractId) {
            const checkContract = await prisma.contract.findUnique({
                where: { id: body.contractId }
            });
            if (!checkContract) {
                throw new QueryError("Contrato inexistente!");
            }
    
            const contractProject = await prisma.project.findFirst({
                where: {
                    contractId: body.contractId,
                    id: { not: id }
                }
            });
            if (contractProject) {
                throw new QueryError("Esse contrato pertence a outro projeto.");
            }
        }
    
        // Validações de equipe
        if (teamToUpdate) {
            if (teamToUpdate.length === 0) {
                throw new QueryError("É necessário associar, pelo menos, um usuário ao projeto.");
            }
    
            if (!teamToUpdate.every(userProject => userProject.userId)) {
                throw new QueryError("Todos os projetos devem ter um usuário associado.");
            }
    
            if (!teamToUpdate.every(userProject => userProject.function)) {
                throw new QueryError("Todos os usuários devem ter uma função associada no projeto.");
            }
    
            const userIds = teamToUpdate.map(userProject => userProject.userId);
            const existingUsers = await prisma.user.findMany({
                where: { id: { in: userIds } }
            });
    
            const existingUserIds = new Set(existingUsers.map(user => user.id));
            if (!userIds.every(id => existingUserIds.has(id))) {
                throw new QueryError("Um ou mais usuários fornecidos não existem.");
            }
    
            const userIdDuplicate = new Set();
            for (const userProject of teamToUpdate) {
                if (userIdDuplicate.has(userProject.userId)) {
                    throw new QueryError("Existem usuários duplicados no projeto.");
                }
                userIdDuplicate.add(userProject.userId);
            }
    
            await prisma.usersProjects.deleteMany({
                where: { projectId: id }
            });
    
            await prisma.usersProjects.createMany({
                data: teamToUpdate.map(userProject => ({
                    userId: userProject.userId,
                    projectId: id,
                    function: userProject.function
                }))
            });
        }
    
        // Atualiza os campos do projeto conforme o que foi fornecido
        const updatedProject = await prisma.project.update({
            where: { id },
            data: {
                ...(body.name && { name: body.name }),
                ...(body.contractId && { contractId: body.contractId }),
                ...(body.date !== undefined && { date: body.date })
            }
        });
    
        return {
            ...updatedProject,
            team: teamToUpdate 
        };
    }
    
    
}

export default new ProjectService();
