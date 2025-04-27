import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Project } from "../../../domain/models/project";

import api from "../../../Services/api";

import Sidebar from "../../components/Sidebar";
import DefaultContainer from "../../components/DefaultContainer";

import { User } from "../../../domain/models/user";
import { ProjectAssignment } from "../../../domain/models/project_assignment";
import { Contract } from "../../../domain/models/contract";

import "./styles.css";

const UpdateProject = () => {
    const { id: projectId } = useParams();
    const navigate = useNavigate();

    // Dynamic data from server
    const [users, setUsers] = useState<User[]>([]);
    const [contracts, setContracts] = useState<Contract[]>([]);

    // Form data
    const [projectName, setProjectName] = useState<string>("");
    const [contractId, setContractId] = useState<number>(0);
    const [date, setDate] = useState<string>("");
    const [teamMembers, setTeamMembers] = useState<ProjectAssignment[]>([]);
    const [currentFunction, setCurrentFunction] = useState<string>("");
    const [userId, setUserId] = useState<number>(0);
    
    useEffect(() => {
        if (projectId === undefined) {
            navigate("/projects");
            return;
        }

        loadProject(parseInt(projectId));
    }, [projectId]);

    useEffect(() => {
        loadUsers();
        loadContracts();
    }, []);

    const loadProject = async (projectId: number) => {
        const { data: project } = await api.get<Project>(`/projects/read/${projectId}`);

        setProjectName(project.name);
        setContractId(project.contractId);
        setDate(project.date);
        setTeamMembers(project.team || []);
    }

    const loadUsers = async () => {
        const { data: users } = await api.get<User[]>("/users");

        setUsers(users);
    }

    const loadContracts = async () => {
        // TODO: Fetch contracts from the API
        // For now, we will use a static list
        const contracts: Contract[] = [
            {
                id: 1,
                title: "Contrato Alpha",
                nameClient: "Cliente A",
                value: 10000,
                date: "2023-01-01",
                archivePath: "/contratos/contrato_alpha.pdf"
            }
        ]

        setContracts(contracts);
    }

    const addMember = () => {
        // Check if the userId is valid
        if (userId <= 0) {
            alert("Selecione um usuário válido.");
            return;
        }

        // Check if the function is provided
        if (currentFunction.trim() === "") {
            alert("Digite a função do usuário.");
            return;
        }

        // Check if the user is already in the team
        const userExists = teamMembers.some(member => member.userId === userId);
        if (userExists) {
            alert("Usuário já adicionado à equipe.");
            return;
        }

        setTeamMembers([...teamMembers, { userId, function: currentFunction }]);

        // Clear the input fields
        setUserId(0);
        setCurrentFunction("");
    }

    const removeMember = (userId: number) => {
        const updatedMembers = teamMembers.filter(member => member.userId !== userId);
        setTeamMembers(updatedMembers);
    }

    const getUserName = (userId: number) => {
        const user = users.find(user => user.id === userId);
        return user ? user.name : "Usuário não encontrado";
    }

    const handleFormSubmit = async () => {
        console.log(`Project Name: ${projectName}, Contract ID: ${contractId}, Date: ${date}`);
        console.log("Team Members:", teamMembers);

        // Validate form data
        if (projectName.trim() === "") {
            alert("Digite o nome do projeto.");
            return;
        }

        if (contractId <= 0) {
            alert("Selecione um contrato válido.");
            return;
        }

        if (date.trim() === "") {
            alert("Selecione uma data válida.");
            return;
        }

        if (teamMembers.length === 0) {
            alert("Adicione pelo menos um membro à equipe.");
            return;
        }

        const request = {
            name: projectName,
            contractId,
            date,
            team: teamMembers
        };

        try {
            const response = await api.put<Project>(`/projects/update/${projectId}`, request);
            console.log("Project updated successfully:", response.data);
            navigate(`/projects/${projectId}`);
        } catch (error) {
            console.error("Error updating project:", error);
            alert("Erro ao atualizar projeto. Tente novamente.");
        }
    }

    return (
        <>
            <Sidebar />

            <DefaultContainer>
                <header className="create-header">
                    <h1><FontAwesomeIcon icon={faEdit} />Atualizar Projeto</h1>
                </header>

                <form id="create-project-form">

                    <div className="form-section">
                        <h2 className="section-title">Detalhes do Projeto</h2>

                        <div className="form-group">
                            <label htmlFor="name">Nome do Projeto</label>
                            <input type="text" id="name" name="name" value={projectName} placeholder="Digite o nome do projeto" required onChange={e => setProjectName(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="contractId">Contrato Vinculado</label>
                            <select id="contractId" name="contractId" value={contractId} required onChange={e => setContractId(parseInt(e.target.value))}>
                                <option value="0" disabled>Selecione um contrato...</option>

                                {contracts.map(contract => (
                                    <option key={contract.id} value={contract.id}>{contract.title} (ID: {contract.id})</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="date">Data de Entrega Prevista</label>
                            <input type="text" id="date" name="date" pattern="\d{2}-\d{2}-\d{4}" placeholder="Ex: 23/07/2016" value={date} required onChange={e => setDate(e.target.value)} />
                        </div>
                    </div>

                    <div className="form-section">
                        <h2 className="section-title">Equipe do Projeto</h2>

                        {teamMembers.map(member => (
                            <div className="updt-team-member">
                                <section>
                                    <p><b>Nome: </b>{getUserName(member.userId)}</p>
                                    <span><b>Função: </b>{member.function}</span>
                                </section>
                                <button onClick={() => removeMember(member.userId)}>x</button>
                            </div>
                        ))}

                        <div id="team-members-container">
                            <div className="add-team-member">
                                <div className="form-group form-group-inline">
                                    <label htmlFor="userId">Usuário</label>
                                    <select id="userId" name="userId" value={userId} required onChange={e => setUserId(parseInt(e.target.value))}>
                                        <option value="0" disabled>Selecione um usuário...</option>

                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>{user.name} (ID: {user.id})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group form-group-inline">
                                    <label htmlFor="function-0">Função</label>
                                    <input type="text" id="function-0" name="team[0][function]" value={currentFunction} placeholder="Ex: Tester" required onChange={e => setCurrentFunction(e.target.value)} />
                                </div>
                                <button type="button" id="add-member-btn" className="button button-secondary" onClick={addMember}>
                                    Adicionar
                                </button>
                            </div>
                            </div>
                        
                    </div>

                    <div className="form-actions">
                        <button type="button" className="button button-primary" onClick={handleFormSubmit}>
                            Atualizar Projeto
                        </button>
                    </div>
                </form>
            </DefaultContainer>
        </>
        
    );
}

export default UpdateProject;
