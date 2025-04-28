import { User } from "./user";

export interface ProjectAssignment {
    userId: number;
    function: string;
    projectId?: number;
    user?: User;
};