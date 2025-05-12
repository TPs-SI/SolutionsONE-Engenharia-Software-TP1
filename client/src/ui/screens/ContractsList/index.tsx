import { useState, useEffect } from "react";
import { Contract } from "../../../domain/models/contract";
import api from "../../../Services/api";
import ListHeader from "../../components/ListHeader";
import ListRenderer from "../../components/ListRenderer";
import ListItem from "../../components/ListItem";
import Sidebar from "../../components/Sidebar";
import DefaultContainer from "../../components/DefaultContainer";
import FloatingLink from "../../components/FloatingLink";
import { faFileContract } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../context/AuthContext";

const ContractsList = () => {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const { user } = useAuth();

    useEffect(() => {
        loadAllContracts();
    }, []);

    const loadAllContracts = async () => {
        try { 
            const { data } = await api.get<Contract[]>("/contracts");
            setContracts(data || []); 
        } catch (error) {
            console.error("Erro ao carregar contratos:", error);
            setContracts([]); 
        }
    }

    // Define os papéis que podem criar contratos
    const canCreateContract = user?.role === "Administrator" || user?.role === "Manager";

    return (
        <>
            <Sidebar />
            <DefaultContainer>
                <ListHeader
                    title="Contratos"
                    icon={faFileContract} // Ícone corrigido
                    onSearch={setSearchQuery}
                />

                <ListRenderer>
                    {
                        contracts
                            .filter(contract => contract.title.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map(contract => (
                                <ListItem
                                    key={contract.id}
                                    title={contract.title}
                                    subtitle={`Cliente: ${contract.nameClient} - Assinatura: ${contract.date}`} // Texto do subtítulo
                                    link={`/contracts/${contract.id}`}
                                />
                        ))
                    }
                    {contracts.length === 0 && <p>Nenhum contrato encontrado.</p>}
                </ListRenderer>

                {/* Renderização condicional do botão/link de criar */}
                {canCreateContract && (
                    <FloatingLink text="Criar Contrato" link="/create-contract" />
                )}
            </DefaultContainer>
        </>
    );
}

export default ContractsList;