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

}

export default new UserService();