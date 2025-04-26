import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

export type ScreenComponent = React.FC<any>; 

export interface RouteConfig {
    link: string;
    componentKey: string;
    menuConfig?: MenuConfig;
    // Removido: component: React.FC; 
}

export interface MenuConfig {
    displayName: string;
    icon: IconDefinition;
    keyword: string;
}

// Mapeamento de chaves para componentes reais (será usado no App.tsx)
// Importe todos os seus componentes de tela aqui
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

export const screenComponentMap: Record<string, ScreenComponent> = {
    LoginScreen: LoginScreen,
    ProjectsList: ProjectsList,
    UsersList: UsersList,
    // ContractsList: ContractsListScreen, // Adicione se/quando existir
    SpecificProject: SpecificProject,
    CreateProject: CreateProject,
    UpdateProject: UpdateProject,
    CreateUser: CreateUser,
    SpecificUser: SpecificUser,
    UpdateUser: UpdateUser,
    MyAccount: MyAccount,
    // Adicione outros mapeamentos conforme necessário
};