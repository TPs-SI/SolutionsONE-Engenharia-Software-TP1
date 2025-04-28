import { Contract } from "./contract";
import { ProjectAssignment } from "./project_assignment";

export interface Project {
    id: number;
    name: string;
    date: string;
    contractId: number;
    team?: ProjectAssignment[];
    contract?: Contract;
}