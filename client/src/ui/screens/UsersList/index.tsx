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

const UsersList = () => {
    const [users, setusers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadAllUsers();
    }, []);

    const loadAllUsers = async () => {
        const { data: users } = await api.get<User[]>("/users");


        setusers(users);
    }

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
                    {
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
                    }
                </ListRenderer>

                <FloatingLink text="Criar" link="/create-user" />
            </DefaultContainer>
        </>

    );
}

export default UsersList;
