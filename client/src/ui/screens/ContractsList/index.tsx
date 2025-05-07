import { useState, useEffect } from "react";

import { Contract } from "../../../domain/models/contract";

import api from "../../../Services/api";

import ListHeader from "../../components/ListHeader";
import ListRenderer from "../../components/ListRenderer";
import ListItem from "../../components/ListItem";
import Sidebar from "../../components/Sidebar";
import DefaultContainer from "../../components/DefaultContainer";
import FloatingLink from "../../components/FloatingLink";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

const ContractsList = () => {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadAllContracts();
    }, []);

    const loadAllContracts = async () => {
        const { data: contracts } = await api.get<Contract[]>("/contracts");
        setContracts(contracts);
    }

    return (
        <>
            <Sidebar />

            <DefaultContainer>
                <ListHeader
                    title="Contratos"
                    icon={faUsers}
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
                                    subtitle={`Cliente: ${contract.nameClient} - Entrega: ${contract.date}`}
                                    link={`/contracts/${contract.id}`}
                                />
                        ))
                    }
                </ListRenderer>

                <FloatingLink text="Criar" link="/create-contract" />
            </DefaultContainer>
        </>
    );
}

export default ContractsList;
