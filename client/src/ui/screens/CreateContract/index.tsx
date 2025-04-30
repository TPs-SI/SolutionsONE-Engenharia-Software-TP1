import { useState, useEffect } from "react"; // useEffect pode não ser mais necessário
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons';

// Modelos relevantes (apenas Contrato é necessário para a criação)
import { Contract } from "../../../domain/models/contract";
// import { User } from "../../../domain/models/user"; // Não mais necessário aqui
// import { ProjectAssignment } from "../../../domain/models/project_assignment"; // Não mais necessário aqui
// import { Project } from "../../../domain/models/project"; // Não mais necessário aqui


import Sidebar from "../../components/Sidebar";
import DefaultContainer from "../../components/DefaultContainer";

import "./styles.css";
import api from "../../../Services/api";

const CreateContract = () => {
    const navigate = useNavigate();

    // Form data - Ajustado para Contrato
    const [title, setTitle] = useState<string>(""); // Renomeado de projectName
    const [clientName, setClientName] = useState<string>("");
    const [contractValue, setContractValue] = useState<number>(0);
    const [date, setDate] = useState<string>("");
    // const [contractId, setContractId] = useState<number>(0); // Removido - ID será gerado na criação
    // const [teamMembers, setTeamMembers] = useState<ProjectAssignment[]>([]); // Removido
    // const [currentFunction, setCurrentFunction] = useState<string>(""); // Removido
    // const [userId, setUserId] = useState<number>(0); // Removido

    // Dynamic data from server - Removido pois não precisamos carregar usuários ou contratos existentes
    // const [users, setUsers] = useState<User[]>([]);
    // const [contracts, setContracts] = useState<Contract[]>([]);

    // useEffect(() => {
        // loadUsers(); // Removido
        // loadContracts(); // Removido
    // }, []); // useEffect não é mais necessário se não houver carregamento inicial

    // Funções relacionadas a usuários e times removidas
    // const loadUsers = async () => { ... }
    // const loadContracts = async () => { ... }
    // const addMember = () => { ... }
    // const removeMember = (userId: number) => { ... }
    // const getUserName = (userId: number) => { ... }


    const handleFormSubmit = async () => {
        console.log(`Title: ${title}, Client: ${clientName}, Value: ${contractValue}, Date: ${date}`);

        // Validate form data - Ajustado para Contrato
        if (title.trim() === "") {
            alert("Digite o título do contrato.");
            return;
        }

        if (clientName.trim() === "") {
            alert("Digite o nome do cliente.");
            return;
        }

        if (contractValue <= 0) { // Ou outra validação que faça sentido para valor
            alert("Digite um valor válido para o contrato.");
            return;
        }

        if (date.trim() === "") { // Considerar validação de formato de data mais robusta
            alert("Selecione uma data válida.");
            return;
        }

        // Removida validação de contractId e teamMembers

        // Payload para a API de criação de contrato
        const request = {
            title,
            nameClient: clientName, // Ajustar nome do campo se necessário pela API
            value: contractValue,
            date,
            // archivePath: "?", // O path do arquivo geralmente é definido após upload, talvez não na criação inicial
        };

        try {
            // Chamar endpoint de criação de Contrato
            // Ajuste o endpoint ('/contracts') conforme necessário
            const response = await api.post<Contract>("/contracts", request);
            const contractId = response.data.id; // Assumindo que a resposta contém o contrato criado com ID

            console.log("Contract created successfully:", response.data);
            alert("Contrato criado com sucesso!");

            // Navegar para a página de detalhes do contrato criado
            // Ajuste o path ('/contracts/') conforme necessário
            navigate(`/contracts/${contractId}`);

        } catch (error) {
            console.error("Error creating contract:", error);
            // Fornecer feedback mais específico se possível (ex: erro de validação da API)
            alert("Erro ao criar contrato. Verifique os dados e tente novamente.");
        }
    }

    return (
        <>
            <Sidebar />

            <DefaultContainer>
                {/* Header consistente com a ação */}
                <header className="create-header">
                    <h1><FontAwesomeIcon icon={faAdd} />Criar Novo Contrato</h1>
                </header>

                {/* ID do formulário consistente com a ação */}
                <form id="create-contract-form">

                    <div className="form-section">
                        <h2 className="section-title">Detalhes do Contrato</h2>

                        {/* Campo Título */}
                        <div className="form-group">
                            <label htmlFor="title">Título</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Digite o título do contrato"
                                required
                                value={title} // Controlar o componente
                                onChange={e => setTitle(e.target.value)}
                            />
                        </div>

                        {/* Campo Valor */}
                        <div className="form-group">
                            <label htmlFor="value">Valor (R$)</label>
                            <input
                                type="number"
                                id="value"
                                name="value"
                                className="input-value-no-spinners" // <-- Classe adicionada
                                placeholder="Digite o valor do contrato"
                                required
                                value={contractValue === 0 ? '' : contractValue} // Exibe vazio se 0 para facilitar digitação inicial
                                onChange={e => {
                                    const val = e.target.value;
                                    // Permite campo vazio ou número (incluindo decimal)
                                    if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                        setContractValue(val === '' ? 0 : Number(val));
                                    }
                                }}
                                min="0"
                            />
                        </div>

                        {/* Campo Cliente */}
                        <div className="form-group">
                            <label htmlFor="clientName">Cliente</label>
                            <input
                                type="text"
                                id="clientName"
                                name="clientName"
                                placeholder="Digite o nome do cliente"
                                required
                                value={clientName} // Controlar o componente
                                onChange={e => setClientName(e.target.value)}
                            />
                        </div>

                        {/* Campo Data */}
                        <div className="form-group">
                            <label htmlFor="date">Data de Assinatura</label>
                            {/* Usar type="date" para melhor UX */}
                            <input
                                type="date"
                                id="date"
                                name="date"
                                required
                                value={date} // Controlar o componente
                                onChange={e => setDate(e.target.value)}
                            />
                            {/* Placeholder não funciona com type="date" na maioria dos browsers modernos */}
                            {/* O formato esperado pela API pode precisar de ajuste */}
                        </div>
                    </div>

                    {/* Seção de adicionar membros REMOVIDA */}

                    <div className="form-actions">
                        {/* Botão consistente com a ação */}
                        <button type="button" className="button button-primary" onClick={handleFormSubmit}>
                            Criar Contrato
                        </button>
                    </div>

                </form>
            </DefaultContainer>
        </>
    );
}

export default CreateContract;