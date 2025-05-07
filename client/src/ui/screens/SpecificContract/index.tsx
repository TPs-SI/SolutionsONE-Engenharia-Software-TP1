import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";


import api from "../../../Services/api";

import Sidebar from "../../components/Sidebar";
import DefaultContainer from "../../components/DefaultContainer";

import "./styles.css";
import { Link } from "react-router-dom";
import { Contract } from "../../../domain/models/contract";

const SpecificContract = () => {
    const { id: contractId } = useParams();
    const navigate = useNavigate();

    const [contract, setContract] = useState<Contract>();

    useEffect(() => {
        if (contractId === undefined) {
            navigate("/contracts");
            return;
        }

        loadContract(parseInt(contractId));
    }, [contractId]);

    const loadContract = async (contractId: number) => {
        const { data: contract } = await api.get<Contract>(`/contracts/read/${contractId}`);

        setContract(contract);
    }

    const deleteContract = async () => {
        await api.delete(`/contracts/remove/${contractId}`);

        navigate("/contracts");
    }

    return (
        <>
            <Sidebar />

            <DefaultContainer>
                <header className="update-header">
                    <h1>{contract?.title}</h1>
                    <div>
                        
                        <Link to={`/update-contract/${contractId}`} className="edit-button">
                            Editar
                        </Link>
                        <button className="delete-button" onClick={deleteContract}>
                            Excluir
                        </button>
                    </div>
                </header>
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
}

export default SpecificContract;
