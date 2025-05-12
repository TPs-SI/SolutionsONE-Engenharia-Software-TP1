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
import ContractsList from '../screens/ContractsList';
import CreateContract from '../screens/CreateContract';
import MyAccount from "../screens/MyAccount";
import UpdateMyAccount from '../screens/UpdateMyAccount';
import SpecificContract from '../screens/SpecificContract';
import UpdateContract from "../screens/UpdateContract";

export const screenComponentMap: Record<string, ScreenComponent> = {
    LoginScreen: LoginScreen,
    ProjectsList: ProjectsList,
    UsersList: UsersList,
    ContractsList: ContractsList, 
    SpecificProject: SpecificProject,
    CreateProject: CreateProject,
    UpdateProject: UpdateProject,
    CreateUser: CreateUser,
    SpecificUser: SpecificUser,
    UpdateUser: UpdateUser,
    MyAccount: MyAccount,
    CreateContract: CreateContract,
    UpdateMyAccount: UpdateMyAccount,
    SpecificContract: SpecificContract,
    UpdateContract: UpdateContract,
    // Adicione outros mapeamentos conforme necessário
};