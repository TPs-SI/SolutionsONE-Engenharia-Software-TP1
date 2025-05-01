import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Contract } from "../../../domain/models/contract";

import api from "../../../Services/api";

import Sidebar from "../../components/Sidebar";
import DefaultContainer from "../../components/DefaultContainer";

import "./styles.css";

const UpdateContract = () => {
    const { id } = useParams(); // Alterado para 'id'
    const navigate = useNavigate();

    const [title, setTitle] = useState<string>("");
    const [clientName, setClientName] = useState<string>("");
    const [contractValue, setContractValue] = useState<number>(0);
    const [date, setDate] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        console.log("Contract ID:", id); // Agora loga 'id'
        if (!id || isNaN(parseInt(id))) { // Verifica 'id'
            navigate("/contracts");
            return;
        }
        loadContract(parseInt(id)); // Passa 'id' para loadContract
    }, [id, navigate]); // Dependência em 'id'

    const loadContract = async (contractId: number) => { // 'contractId' aqui é o parâmetro da função
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const { data: contract } = await api.get<Contract>(`/contracts/read/${contractId}`); // Usa 'contractId' (parâmetro da função)
            console.log("Dados do Contrato da API:", contract);
            setTitle(contract.title || "");
            setClientName(contract.nameClient || "");
            setContractValue(contract.value || 0);
            setDate(contract.date || "");
        } catch (error: any) {
            console.error("Error loading contract:", error);
            setErrorMessage("Erro ao carregar contrato. Verifique o ID e tente novamente.");
            // Não navegar imediatamente, permite exibir a mensagem de erro
            // navigate("/contracts");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = async () => {
        if (title.trim() === "") {
            alert("Digite o título do contrato.");
            return;
        }

        if (clientName.trim() === "") {
            alert("Digite o nome do cliente.");
            return;
        }

        if (contractValue <= 0) {
            alert("Digite um valor válido para o contrato.");
            return;
        }

        if (date.trim() === "") {
            alert("Selecione uma data válida.");
            return;
        }
        const request = {
            title,
            nameClient: clientName,
            value: contractValue,
            date,
        };

        try {
            await api.put<Contract>(`/contracts/update/${id}`, request); // Usa 'id' para a atualização
            console.log("Contract updated successfully!");
            setSuccessMessage("Contrato atualizado com sucesso!");
            setTimeout(() => {
                navigate(`/contracts/${id}`); // Redireciona usando 'id'
            }, 1500);
        } catch (error) {
            console.error("Error updating contract:", error);
            alert("Erro ao atualizar o contrato. Verifique os dados e tente novamente.");
        }
    };

    if (isLoading) {
        return (
            <>
                <Sidebar />
                <DefaultContainer>
                    <p>Carregando informações do contrato...</p>
                </DefaultContainer>
            </>
        );
    }

    if (errorMessage) {
        return (
            <>
                <Sidebar />
                <DefaultContainer>
                    <div className="error-message">{errorMessage}</div>
                    <button onClick={() => navigate("/contracts")}>Voltar para a lista de contratos</button>
                </DefaultContainer>
            </>
        );
    }

    return (
        <>
            <Sidebar />
            <DefaultContainer>
                <header className="create-header">
                    <h1><FontAwesomeIcon icon={faEdit} /> Atualizar Contrato</h1>
                </header>

                {successMessage && <div className="success-message">{successMessage}</div>}

                <form id="update-contract-form">
                    <div className="form-section">
                        <h2 className="section-title">Detalhes do Contrato</h2>

                        <div className="form-group">
                            <label htmlFor="title">Título</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Digite o título do contrato"
                                required
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="value">Valor (R$)</label>
                            <input
                                type="number"
                                id="value"
                                name="value"
                                className="input-value-no-spinners"
                                placeholder="Digite o valor do contrato"
                                required
                                value={contractValue === 0 ? '' : contractValue}
                                onChange={e => {
                                    const val = e.target.value;
                                    if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                        setContractValue(val === '' ? 0 : Number(val));
                                    }
                                }}
                                min="0"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="clientName">Cliente</label>
                            <input
                                type="text"
                                id="clientName"
                                name="clientName"
                                placeholder="Digite o nome do cliente"
                                required
                                value={clientName}
                                onChange={e => setClientName(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="date">Data de Assinatura</label>
                            <input
                                type="text"
                                id="date"
                                name="date"
                                pattern="\d{2}-\d{2}-\d{4}"
                                placeholder="Ex: 23/07/2016"
                                required
                                value={date}
                                onChange={e => setDate(e.target.value)}
                            />
                            {/* Considere usar <input type="date"> */}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="button button-primary" onClick={handleFormSubmit}>
                            Atualizar Contrato
                        </button>
                    </div>
                </form>
            </DefaultContainer>
        </>
    );
};

export default UpdateContract;