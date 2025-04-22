import { useState, useEffect } from "react";

import { Project } from "../../../domain/models/project";

import api from "../../../config/api";

import ListHeader from "../../components/ListHeader";

import ListRenderer from "../../components/ListRenderer";
import ListItem from "../../components/ListItem";
import Sidebar from "../../components/Sidebar";
import DefaultContainer from "../../components/DefaultContainer";
import FloatingLink from "../../components/FloatingLink";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

const ProjectsList = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadAllProjects();
    }, []);

    const loadAllProjects = async () => {
        const { data: projects } = await api.get<Project[]>("/projects");


        setProjects(projects);
    }

    return (
        <>
            <Sidebar />

            <DefaultContainer>
                <ListHeader
                    title="Projetos"
                    icon={faUsers}
                    onSearch={setSearchQuery}
                />

                <ListRenderer>
                    {
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
                    }
                </ListRenderer>

                <FloatingLink text="Criar" link="/create-project" />
            </DefaultContainer>
        </>
        
    );
}

export default ProjectsList;
