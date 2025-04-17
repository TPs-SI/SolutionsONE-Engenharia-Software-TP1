import React from "react";

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
            icon: "briefcase",
            keyword: "project"
        },
    },
    {
        link: "/users",
        component: ProjectsList,
        menuConfig: {
            displayName: "Usuários",
            icon: "users",
            keyword: "user"
        }
    },
    {
        link: "/contracts",
        component: ProjectsList,
        menuConfig: {
            displayName: "Contratos",
            icon: "file-contract",
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