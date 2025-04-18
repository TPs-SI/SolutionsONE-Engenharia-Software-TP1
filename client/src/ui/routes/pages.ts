import React from "react";
import { faFileContract, faProjectDiagram, faUsers } from "@fortawesome/free-solid-svg-icons";

import { Route } from "./route";

import ProjectsList from "../screens/ProjectsList";
import CreateProject from "../screens/CreateProject";
import SpecificProject from "../screens/SpecificProject";
import UpdateProject from "../screens/UpdateProject";

const pages: Route[] = [
    {
        link: "/projects",
        component: ProjectsList,
        menuConfig: {
            displayName: "Projetos",
            icon: faProjectDiagram,
            keyword: "project"
        },
    },
    {
        link: "/users",
        component: ProjectsList,
        menuConfig: {
            displayName: "Usuários",
            icon: faUsers,
            keyword: "user"
        }
    },
    {
        link: "/contracts",
        component: ProjectsList,
        menuConfig: {
            displayName: "Contratos",
            icon: faFileContract,
            keyword: "contract"
        }
    },
    {
        link: "/projects/:id",
        component: SpecificProject
    },
    {
        link: "/create-project",
        component: CreateProject
    },
    {
        link: "/update-project/:id",
        component: UpdateProject
    }
];

export default pages;