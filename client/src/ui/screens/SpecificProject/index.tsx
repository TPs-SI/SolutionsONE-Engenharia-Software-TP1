import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import api from "../../../config/api";
import { Project } from "../../../domain/models/project";

import Sidebar from "../../components/Sidebar";
import DefaultContainer from "../../components/DefaultContainer";

import "./styles.css";
import { Link } from "react-router-dom";

const SpecificProject = () => {
    const { id: projectId } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState<Project>();

    useEffect(() => {
        if (projectId === undefined) {
            navigate("/projects");
            return;
        }

        loadProject(parseInt(projectId));
    }, [projectId]);

    const loadProject = async (projectId: number) => {
        const { data: project } = await api.get<Project>(`/projects/read/${projectId}`);

        setProject(project);
    }

    const deleteProject = async () => {
        await api.delete(`/projects/remove/${projectId}`);

        navigate("/projects");
    }

    return (
        <>
            <Sidebar />

            <DefaultContainer>
                <header className="update-header">
                    <h1>{project?.name}</h1>
                    <div>
                        <Link to={`/update-project/${projectId}`} className="edit-button">
                            Editar
                        </Link>
                        <button className="delete-button" onClick={deleteProject}>
                            Excluir
                        </button>
                    </div>
                </header>

                <section className="project-details">
                    <h2>Detalhes do Projeto</h2>
                    <p><strong>ID do Projeto:</strong> {project?.id}</p>
                    <p><strong>Data do Projeto:</strong> {project?.date}</p>
                </section>

                <hr className="divider" />

                <section className="contract-details">
                    <h3>Contrato</h3>
                    <p><strong>Título:</strong> {project?.contract?.title}</p>
                    <p><strong>ID do Contrato:</strong> {project?.contract?.id}</p>
                    <p><strong>Valor:</strong> R$ {project?.contract?.value}</p>
                    <p><strong>Data:</strong> {project?.contract?.date}</p>
                    <p><strong>Cliente:</strong> {project?.contract?.nameClient}</p>
                    <a href={project?.contract?.archivePath} className="download-button" download>
                        <FontAwesomeIcon icon={faDownload} />Baixar arquivo
                    </a>
                </section>

                <hr className="divider" />

                <section className="team-details">
                    <h3>Equipe</h3>
                    <div className="team-list">
                        {
                            project?.team?.map(member => (
                                <div className="team-member" key={member.userId}>
                                    <img src={member.user?.photo} alt={`Foto de ${member.user?.name}`} className="user-photo" />
                                    <div className="member-info">
                                        <p><strong>Nome:</strong> {member.user?.name}</p>
                                        <p><strong>Função:</strong> {member.function}</p>
                                        <p><strong>Email:</strong> {member.user?.email}</p>
                                        <p><strong>Celular:</strong> {member.user?.cellphone}</p>
                                        <p><strong>Nascimento:</strong> {member.user?.birth}</p>
                                        <p><strong>Status:</strong> {member.user?.status}</p>
                                        <p><strong>Papel (Role):</strong> {member.user?.role}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </section>
            </DefaultContainer>
        </>
        
    );
}

export default SpecificProject;
