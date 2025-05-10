import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Sidebar from "../../components/Sidebar";
import DefaultContainer from "../../components/DefaultContainer";
import api from "../../../Services/api";
import { useAuth } from "../../../context/AuthContext"; // Importar
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
  const { user: authUser } = useAuth(); // Obter usuário autenticado

  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const DEFAULT_PHOTO = "https://img.freepik.com/vetores-premium/ilustracao-em-vetor-de-icone-de-perfil-de-usuario-masculino-padrao_276184-168.jpg?w=900";

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setError("ID inválido.");
      return;
    }
    loadUser(Number(id));
  }, [id]);

  const loadUser = async (userId: number) => {
    try {
      const { data } = await api.get<User>(`/users/admin/member/read/${userId}`);
      setUser(data);
    } catch (err) {
      setError("Usuário não encontrado.");
    }
  };

  const handleDeleteUser = async () => { // Renomeado para evitar conflito de nome
    if (!id || !canManageUser) return; // Checagem de permissão aqui também
    if (window.confirm(`Tem certeza que deseja excluir o usuário ${user?.name}?`)) {
      try {
        await api.delete(`/users/admin/remove/${id}`);
        alert("Usuário excluído com sucesso!");
        navigate("/users");
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        alert("Falha ao excluir usuário.");
      }
    }
  };

  // Permissões para gerenciar este usuário (editar/excluir)
  const canManageUser = authUser?.role === "Administrator";

  if (error) { /* ... (bloco de erro inalterado) ... */ }
  if (!user && !error) { /* ... (bloco de loading) ... */ }


  return (
    <>
      <Sidebar />
      <DefaultContainer>
        <header className="update-header">
          <h1>
            <FontAwesomeIcon icon={faUser} /> {user?.name}
          </h1>
          {/* Mostrar botões apenas se tiver permissão */}
          {canManageUser && (
            <div>
              <Link to={`/update-user/${id}`} className="edit-button">
                Editar
              </Link>
              <button className="delete-button" onClick={handleDeleteUser}>
                Excluir
              </button>
            </div>
          )}
        </header>
        {/* ... (restante do JSX para detalhes do usuário inalterado) ... */}
        <section className="project-details">
          <h2>Informações do Usuário</h2>
          <img src={user?.photo || DEFAULT_PHOTO} alt={`Foto de ${user?.name}`} className="user-photo" />
          <p><strong>ID:</strong> {user?.id}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Celular:</strong> {user?.cellphone}</p>
          <p><strong>Data de Nascimento:</strong> {user?.birth}</p>
          <p><strong>Status:</strong> {user?.status}</p>
          <p><strong>Cargo:</strong> {user?.role ?? "Não definido"}</p>
        </section>
      </DefaultContainer>
    </>
  );
};

export default SpecificUser;