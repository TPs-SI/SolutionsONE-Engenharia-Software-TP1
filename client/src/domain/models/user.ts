import { ProjectAssignment } from "./project_assignment";

export interface User {
    id: number;
    email: string;
    name: string;
    photo: string;
    cellphone: string;
    birth: string;
    status: string;
    role: string;
    projects: ProjectAssignment[];
}