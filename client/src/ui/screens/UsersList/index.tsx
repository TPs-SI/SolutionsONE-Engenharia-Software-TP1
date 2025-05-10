import { useState, useEffect } from "react";
import { User } from "../../../domain/models/user";
import api from "../../../Services/api";
import ListHeader from "../../components/ListHeader";
import ListRenderer from "../../components/ListRenderer";
import ListItem from "../../components/ListItem";
import Sidebar from "../../components/Sidebar";
import DefaultContainer from "../../components/DefaultContainer";
import FloatingLink from "../../components/FloatingLink";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../context/AuthContext"; 

const UsersList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const { user: authUser } = useAuth(); 

    useEffect(() => {
        loadAllUsers();
    }, []);

    const loadAllUsers = async () => {
        try {
            const { data } = await api.get<User[]>("/users");
            setUsers(data || []);
        } catch (error) {
            console.error("Erro ao carregar usuários:", error);
            setUsers([]);
        }
    };

    const canCreateUser = authUser?.role === "Administrator";

    return (
        <>
            <Sidebar />
            <DefaultContainer>
                <ListHeader
                    title="Usuários"
                    icon={faUserGroup}
                    onSearch={setSearchQuery}
                />
                <ListRenderer>
                    {users.length > 0 ? (
                        users
                            .filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map(user => (
                                <ListItem
                                    key={user.id}
                                    title={user.name}
                                    subtitle={
                                        <>
                                            <span>E-mail: {user.email}</span>
                                            <br />
                                            <span>Cargo: {user.role ?? "Não informado"}</span>
                                        </>
                                    }
                                    link={`/users/${user.id}`}
                                />
                            ))
                    ) : (
                        <p>Nenhum usuário encontrado.</p>
                    )}
                </ListRenderer>

                {canCreateUser && (
                    <FloatingLink text="Criar Usuário" link="/create-user" />
                )}
            </DefaultContainer>
        </>
    );
};

export default UsersList;