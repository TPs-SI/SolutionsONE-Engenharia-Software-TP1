import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api, { BASE_URL } from "../../../Services/api";
import { Project } from "../../../domain/models/project";
import Sidebar from "../../components/Sidebar";
import DefaultContainer from "../../components/DefaultContainer";
import { useAuth } from "../../../context/AuthContext"; // Importar
import "./styles.css";

const SpecificProject = () => {
    const { id: projectId } = useParams();
    const navigate = useNavigate();
    const { user: authUser } = useAuth(); // Obter usuário autenticado

    const [project, setProject] = useState<Project>();

    useEffect(() => {
        if (projectId === undefined) {
            navigate("/projects");
            return;
        }
        loadProject(parseInt(projectId));
    }, [projectId, navigate]); // Adicionar navigate

    const loadProject = async (id: number) => { // Renomear parâmetro para evitar conflito
        try {
            const { data } = await api.get<Project>(`/projects/read/${id}`);
            setProject(data);
        } catch (error) {
            console.error("Erro ao carregar projeto:", error);
            // Lidar com erro, ex: navigate('/projects') ou mostrar mensagem
        }
    };

    const handleDeleteProject = async () => { // Renomear
        if (!projectId || !canManageProject) return;
         if (window.confirm(`Tem certeza que deseja excluir o projeto ${project?.name}?`)) {
            try {
                await api.delete(`/projects/${projectId}`); // Ajustar endpoint se necessário
                alert("Projeto excluído com sucesso!");
                navigate("/projects");
            } catch (error) {
                console.error("Erro ao excluir projeto:", error);
                alert("Falha ao excluir projeto.");
            }
        }
    };

    const canManageProject = authUser?.role === "Administrator" || authUser?.role === "Manager";

    if (!project) { /* ... (bloco de loading) ... */ }

    return (
        <>
            <Sidebar />
            <DefaultContainer>
                <header className="update-header">
                    <h1>{project?.name}</h1>
                    {canManageProject && (
                        <div>
                            <Link to={`/update-project/${projectId}`} className="edit-button">
                                Editar
                            </Link>
                            <button className="delete-button" onClick={handleDeleteProject}>
                                Excluir
                            </button>
                        </div>
                    )}
                </header>
                {/* ... (restante do JSX inalterado) ... */}
                <section className="project-details">
                    <h2>Detalhes do Projeto</h2>
                    <p><strong>ID do Projeto:</strong> {project?.id}</p>
                    <p><strong>Data do Projeto:</strong> {project?.date}</p>
                </section>
                <hr className="divider" />
                 <section className="contract-details">
                    <h3>Contrato</h3>
                    <p><strong>Título:</strong> {project?.contract?.title}</p>
                    <a href={BASE_URL + project?.contract?.archivePath} className="download-button" target="_blank" rel="noopener noreferrer">
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
};

export default SpecificProject;