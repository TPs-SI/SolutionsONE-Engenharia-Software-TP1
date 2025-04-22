// import React from "react";
import { faFileContract, faProjectDiagram, faUsers } from "@fortawesome/free-solid-svg-icons";

import { Route } from "./route";

import ProjectsList from "../screens/ProjectsList";
import CreateProject from "../screens/CreateProject";
import SpecificProject from "../screens/SpecificProject";
import UpdateProject from "../screens/UpdateProject";
import LoginScreen from "../screens/Login"; 

import CreateUser from "../screens/CreateUser";
import UsersList from "../screens/UsersList";
import SpecificUser from "../screens/SpecificUser";
import UpdateUser from "../screens/UpdateUser";
import MyAccount from "../screens/myAccount";

const pages: Route[] = [
    {
        link: "/login", 
        component: LoginScreen,
    },
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
        component: UsersList,
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
    },
    {
        link: "/create-user",
        component: CreateUser
    },
    {
        link: "/users/:id",
        component: SpecificUser
    },
    {
        link: "/update-user/:id",
        component: UpdateUser
    },
    {
        link: "/my-account",
        component: MyAccount
    }
    
];

export default pages;