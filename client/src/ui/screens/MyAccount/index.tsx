import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

import Sidebar from "../../components/Sidebar";
import DefaultContainer from "../../components/DefaultContainer";
import api from "../../../Services/api";

import "./styles.css";

interface User {
  id: number;
  name: string;
  email: string;
  cellphone: string;
  birth: string;
  github?: string;
  photo: string;
}

const MyAccount = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const DEFAULT_PHOTO = "https://img.freepik.com/vetores-premium/ilustracao-em-vetor-de-icone-de-perfil-de-usuario-masculino-padrao_276184-168.jpg?w=900";

  useEffect(() => {
    loadMyAccount();
  }, []);

  const loadMyAccount = async () => {
    try {
      const { data } = await api.get<User>("/users/account");
      setUser(data);
    } catch (error) {
      console.error("Erro ao carregar os dados da conta.");
    }
  };

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
              {user.github && (
                <p>
                  <strong>Github:</strong> @{user.github}
                </p>
              )}
              <p>
                <strong>Senha:</strong> ********
              </p>
            </div>

            <div className="account-button">
              <button
                className="button button-primary"
                onClick={() => navigate("/update-account")}
              >
                <FontAwesomeIcon icon={faPen} /> Editar
              </button>
            </div>
          </div>
        )}
      </DefaultContainer>
    </>
  );
};

export default MyAccount;
