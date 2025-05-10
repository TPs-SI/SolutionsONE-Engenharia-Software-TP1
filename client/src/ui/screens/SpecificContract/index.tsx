import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../../Services/api";
import Sidebar from "../../components/Sidebar";
import DefaultContainer from "../../components/DefaultContainer";
import { Contract } from "../../../domain/models/contract";
import { useAuth } from "../../../context/AuthContext"; // Importar
import "./styles.css";

const SpecificContract = () => {
    const { id: contractId } = useParams();
    const navigate = useNavigate();
    const { user: authUser } = useAuth(); // Obter usuário autenticado

    const [contract, setContract] = useState<Contract>();

    useEffect(() => {
        if (contractId === undefined) {
            navigate("/contracts");
            return;
        }
        loadContract(parseInt(contractId));
    }, [contractId, navigate]); // Adicionar navigate

    const loadContract = async (id: number) => { // Renomear parâmetro
        try {
            const { data } = await api.get<Contract>(`/contracts/read/${id}`);
            setContract(data);
        } catch (error) {
            console.error("Erro ao carregar contrato:", error);
        }
    };

    const handleDeleteContract = async () => { // Renomear
        if (!contractId || !canManageContract) return;
        if (window.confirm(`Tem certeza que deseja excluir o contrato ${contract?.title}?`)) {
            try {
                await api.delete(`/contracts/${contractId}`); // Ajustar endpoint se necessário
                alert("Contrato excluído com sucesso!");
                navigate("/contracts");
            } catch (error) {
                console.error("Erro ao excluir contrato:", error);
                alert("Falha ao excluir contrato.");
            }
        }
    };

    const canManageContract = authUser?.role === "Administrator" || authUser?.role === "Manager";

    if (!contract) { /* ... (bloco de loading) ... */ }

    return (
        <>
            <Sidebar />
            <DefaultContainer>
                <header className="update-header">
                    <h1>{contract?.title}</h1>
                    {canManageContract && (
                        <div>
                            <Link to={`/update-contract/${contractId}`} className="edit-button">
                                Editar
                            </Link>
                            <button className="delete-button" onClick={handleDeleteContract}>
                                Excluir
                            </button>
                        </div>
                    )}
                </header>
                {/* ... (restante do JSX para detalhes do contrato inalterado) ... */}
                <section className="project-details">
                    <h2>Detalhes do Contrato</h2>
                    <p><strong>ID do Contrato:</strong> {contract?.id}</p>
                    <p><strong>Nome do Cliente:</strong> {contract?.nameClient}</p>
                    <p><strong>Valor:</strong> {contract?.value}</p>
                    <p><strong>Data de Assinatura:</strong> {contract?.date}</p>
                </section>
            </DefaultContainer>
        </>
    );
};

export default SpecificContract;