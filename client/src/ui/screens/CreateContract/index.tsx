import { useState } from "react"; // useEffect pode não ser mais necessário
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
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        setFile(selectedFile);
    };

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

        const formData = new FormData();
        formData.append("title", title);
        formData.append("nameClient", clientName);
        formData.append("value", String(contractValue));
        formData.append("date", date);
        if (file) {
            formData.append("file", file);
       }

        try {
            // Chamar endpoint de criação de Contrato
            // Ajuste o endpoint ('/contracts') conforme necessário
            const response = await api.post<Contract>("/contracts/create", formData);
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
                            <input type="text" id="date" name="date" pattern="\d{2}-\d{2}-\d{4}" placeholder="Ex: 23/07/2016" required onChange={e => setDate(e.target.value)} />
                            {/* Placeholder não funciona com type="date" na maioria dos browsers modernos */}
                            {/* O formato esperado pela API pode precisar de ajuste */}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="contractFile" className="file-upload-label">
                            Arquivo do Contrato
                        </label>
                        <input
                            type="file"
                            id="contractFile"
                            name="contractFile"
                            className="file-upload-input" // Classe para ocultar o input padrão
                            onChange={handleFileChange} // Lidar com a seleção do arquivo
                            accept=".pdf,.doc,.docx,.jpg,.png" // Opcional: definir tipos de arquivo permitidos
                        />
                        {/* Opcional: Exibir o nome do arquivo selecionado */}
                        {file && <span className="file-name">{file.name}</span>}
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