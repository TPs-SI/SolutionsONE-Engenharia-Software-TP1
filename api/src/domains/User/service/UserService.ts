import { User } from "@prisma/client";
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

}

export default new UserService();