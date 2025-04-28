import { faFileContract, faProjectDiagram, faUsers } from "@fortawesome/free-solid-svg-icons";
import { RouteConfig } from "./route"; 

// Agora 'pages' contém apenas a configuração, usando 'componentKey'
const pages: RouteConfig[] = [
    {
        link: "/login",
        componentKey: "LoginScreen",
    },
    {
        link: "/projects",
        componentKey: "ProjectsList",
        menuConfig: {
            displayName: "Projetos",
            icon: faProjectDiagram,
            keyword: "project"
        },
    },
    {
        link: "/users",
        componentKey: "UsersList",
        menuConfig: {
            displayName: "Usuários",
            icon: faUsers,
            keyword: "user"
        }
    },
    {
        link: "/contracts",
        // ATENÇÃO: Precisa de uma chave para a tela de Contratos quando ela existir
        componentKey: "ProjectsList", // Usando ProjectsList como placeholder
        menuConfig: {
            displayName: "Contratos",
            icon: faFileContract,
            keyword: "contract"
        }
    },
    {
        link: "/projects/:id",
        componentKey: "SpecificProject" 
    },
    {
        link: "/create-project",
        componentKey: "CreateProject"
    },
    {
        link: "/update-project/:id",
        componentKey: "UpdateProject" 
    },
    {
        link: "/create-user",
        componentKey: "CreateUser"
    },
    {
        link: "/users/:id",
        componentKey: "SpecificUser" 
    },
    {
        link: "/update-user/:id",
        componentKey: "UpdateUser" 
    },
    {
        link: "/my-account",
        componentKey: "MyAccount" 
    },
    {
        link: "/update-account",
        componentKey: "UpdateMyAccount" 
    }
];

export default pages; // Exporta apenas o array de configuração