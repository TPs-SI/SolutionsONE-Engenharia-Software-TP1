import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import DefaultContainer from "../../components/DefaultContainer";
import api from "../../../Services/api";
import axios from 'axios';

import "./styles.css";

interface User {
  id: number;
  name: string;
  email: string;
  cellphone: string;
  birth: string;
  github?: string;
  photo: string;
  role?: string | null;
}

const MyAccount: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  const DEFAULT_PHOTO = "https://img.freepik.com/vetores-premium/ilustracao-em-vetor-de-icone-de-perfil-de-usuario-masculino-padrao_276184-168.jpg?w=900";

  useEffect(() => {
    if (!isAuthenticated && !localStorage.getItem('authToken')) {
        navigate('/login');
        return;
    }
    loadMyAccount();
  }, [isAuthenticated, navigate]);

  const loadMyAccount = async () => {
    try {
      const { data } = await api.get<User>("/users/account");
      setUser(data);
    } catch (error) {
      console.error("Erro ao carregar os dados da conta:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        logout();
      }
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!user && isAuthenticated) {
    return (
        <>
            <Sidebar />
            <DefaultContainer>
                <div>Carregando dados da conta...</div>
            </DefaultContainer>
        </>
    );
  }

  if (!isAuthenticated) {
      return null;
  }

  return (
    <>
      <Sidebar />
      <DefaultContainer>
        {user && (
          <div className="account-container">
            <img
              src={user.photo || DEFAULT_PHOTO}
              alt={`Foto de ${user.name}`}
              className="account-photo"
            />
            <h1 className="account-name">{user.name}</h1>

            <div className="account-info">
              <h3>Dados pessoais</h3>
              <hr />
              <p>
                <strong>E-mail:</strong> {user.email}
              </p>
              <p>
                <strong>Data de nascimento:</strong> {user.birth}
              </p>
              <p>
                <strong>Celular:</strong> {user.cellphone}
              </p>
              {user.role && (
                  <p>
                      <strong>Perfil:</strong> {user.role}
                  </p>
              )}
              <p>
                <strong>Senha:</strong> ********
              </p>
            </div>

            {/* Container dedicado para os botões de ação */}
            <div className="account-actions-container">
              <button
                className="button button-primary"
                onClick={() => navigate("/update-account")}
              >
                <FontAwesomeIcon icon={faPen} /> Editar
              </button>
              <button
                className="button button-danger"
                onClick={handleLogout}
              >
                <FontAwesomeIcon icon={faSignOutAlt} /> Sair
              </button>
            </div>
          </div>
        )}
      </DefaultContainer>
    </>
  );
};

export default MyAccount;