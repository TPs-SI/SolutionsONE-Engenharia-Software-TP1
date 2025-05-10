import { useState, useEffect } from "react";
import { Project } from "../../../domain/models/project";
import api from "../../../Services/api";
import ListHeader from "../../components/ListHeader";
import ListRenderer from "../../components/ListRenderer";
import ListItem from "../../components/ListItem";
import Sidebar from "../../components/Sidebar";
import DefaultContainer from "../../components/DefaultContainer";
import FloatingLink from "../../components/FloatingLink";
import { faProjectDiagram } from "@fortawesome/free-solid-svg-icons"; // Ícone correto
import { useAuth } from "../../../context/AuthContext"; // Importar

const ProjectsList = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const { user: authUser } = useAuth(); // Obter usuário autenticado

    useEffect(() => {
        loadAllProjects();
    }, []);

    const loadAllProjects = async () => {
        try {
            const { data } = await api.get<Project[]>("/projects");
            setProjects(data || []);
        } catch (error) {
            console.error("Erro ao carregar projetos:", error);
            setProjects([]);
        }
    };

    const canCreateProject = authUser?.role === "Administrator" || authUser?.role === "Manager";

    return (
        <>
            <Sidebar />
            <DefaultContainer>
                <ListHeader
                    title="Projetos"
                    icon={faProjectDiagram} // Ícone correto
                    onSearch={setSearchQuery}
                />
                <ListRenderer>
                    {projects.length > 0 ? (
                        projects
                            .filter(project => project.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map(project => (
                                <ListItem
                                    key={project.id}
                                    title={project.name}
                                    subtitle={`Entrega: ${project.date}`}
                                    link={`/projects/${project.id}`}
                                />
                            ))
                    ) : (
                        <p>Nenhum projeto encontrado.</p>
                    )}
                </ListRenderer>

                {canCreateProject && (
                    <FloatingLink text="Criar Projeto" link="/create-project" />
                )}
            </DefaultContainer>
        </>
    );
};

export default ProjectsList;