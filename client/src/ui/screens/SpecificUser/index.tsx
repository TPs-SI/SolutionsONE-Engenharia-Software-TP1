import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./styles.css";


import Sidebar from "../../components/Sidebar";
import DefaultContainer from "../../components/DefaultContainer";
import api from "../../../config/api";

import "./styles.css";

interface User {
  id: number;
  email: string;
  name: string;
  photo: string;
  cellphone: string;
  birth: string;
  status: string;
  role: string | null;
}

const SpecificUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setError("ID inválido.");
      return;
    }

    loadUser(Number(id));
  }, [id]);

  const loadUser = async (userId: number) => {
    try {
      const { data } = await api.get<User>(
        `/users/admin/member/read/${userId}`
      );
      setUser(data);
    } catch (err) {
      setError("Usuário não encontrado.");
    }
  };

  const deleteUser = async () => {
    if (!id) return;
    try {
      await api.delete(`/users/${id}`);
      navigate("/users");
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    }
  };

  if (error) {
    return (
      <>
        <Sidebar />
        <DefaultContainer>
          <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
          <button onClick={() => navigate("/users")}>Voltar</button>
        </DefaultContainer>
      </>
    );
  }

  return (
    <>
      <Sidebar />

      <DefaultContainer>
        <header className="update-header">
          <h1>
            <FontAwesomeIcon icon={faUser} /> {user?.name}
          </h1>
          <div>
            <Link to={`/update-user/${id}`} className="edit-button">
              Editar
            </Link>
            <button className="delete-button" onClick={deleteUser}>
              Excluir
            </button>
          </div>
        </header>

        <section className="project-details">
          <h2>Informações do Usuário</h2>
          <img
            src={user?.photo}
            alt={`Foto de ${user?.name}`}
            className="user-photo"
          />
          <p>
            <strong>ID:</strong> {user?.id}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Celular:</strong> {user?.cellphone}
          </p>
          <p>
            <strong>Data de Nascimento:</strong> {user?.birth}
          </p>
          <p>
            <strong>Status:</strong> {user?.status}
          </p>
          <p>
            <strong>Cargo:</strong> {user?.role ?? "Não definido"}
          </p>
        </section>
      </DefaultContainer>
    </>
  );
};

export default SpecificUser;
