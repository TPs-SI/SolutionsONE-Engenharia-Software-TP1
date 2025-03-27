import { User } from "@prisma/client";
import prisma from "../../../../config/prismaClient";

import {selectItems, selectItems2} from "./excludeAttributes";
import bcrypt from "bcrypt"
import crypto from 'crypto';

import { InvalidParamError } from "../../../../errors/InvalidParamError";
import { NotAuthorizedError } from "../../../../errors/NotAuthorizedError";
import { PermissionError } from "../../../../errors/PermissionError";
import { QueryError } from"../../../../errors/QueryError";

const validRoles = ['Manager', 'Administrator', 'Member'];
const validStatus = ['Pending', 'Active'];

class UserService {

	async encryptPassword(password: string) {
		const saltRounds = 10;
		const encrypted = await bcrypt.hash(password, saltRounds);
		return encrypted;
	}

    async createUser(body: User) {
        const checkUser = await prisma.user.findUnique({
			where: {
				email: body.email
			}
		});

		if(checkUser){
			throw new QueryError("Esse email já esta cadastrado.");
		}
        
        if(body.role != null){
            throw new NotAuthorizedError("Não é possível inserir o próprio cargo.");
        }

        if(body.status != null){
            throw new NotAuthorizedError("Não é possível inserir o próprio status.");
        }

        if (body.password!=null){
			const encrypted = await this.encryptPassword(body.password);

			const user = await prisma.user.create({
				data: {
					id: body.id,
					email: body.email,
					name: body.name,
					password: encrypted,
					key:" ",
					cellphone: body.cellphone,
					birth: body.birth,    
					status: "Pending",
					role: null,
					resetToken: null,
					tokenExpires: null,
				},
				select: selectItems
			})

			return user;
		}
	}

	async readUser(id: number) {
        const user = await prisma.user.findUnique({
            where: {id: id},
            select: selectItems
        });
    
        if(!user){
            throw new QueryError("Id de usuário inexistente e/ou inválido");
        }

        return user;
    }

}

export default new UserService();