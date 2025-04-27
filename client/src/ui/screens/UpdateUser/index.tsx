import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  photo: string;
  role: string | null;
  status: string;
}

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      navigate("/users");
      return;
    }

    loadUser(Number(id));
  }, [id]);

  const loadUser = async (userId: number) => {
    try {
      const { data } = await api.get<User>(`/users/admin/member/read/${userId}`);
      setUser(data);
    } catch (err) {
      alert("Erro ao carregar usuário.");
      navigate("/users");
    }
  };

  const handleFormSubmit = async () => {
    if (!user) return;

    if (!user.name || !user.email || !user.cellphone || !user.birth) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await api.put(`/users/admin/update/${user.id}`, user);
      alert("Usuário atualizado com sucesso.");
      navigate(`/users/${user.id}`);
    } catch (error) {
      alert("Erro ao atualizar usuário.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setUser(prev => prev ? { ...prev, role: value } : null);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setUser(prev => prev ? { ...prev, status: value } : null);
  };

  return (
    <>
      <Sidebar />

      <DefaultContainer>
        <header className="create-header">
          <h1><FontAwesomeIcon icon={faEdit} /> Atualizar Usuário</h1>
        </header>

        {user && (
          <form>
            <div className="form-section">
              <h2 className="section-title">Dados Pessoais</h2>

              <div className="form-group">
                <label htmlFor="name">Nome</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cellphone">Celular</label>
                <input
                  type="text"
                  id="cellphone"
                  name="cellphone"
                  value={user.cellphone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="birth">Data de Nascimento</label>
                <input
                  type="text"
                  id="birth"
                  name="birth"
                  value={user.birth}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Permissões</h2>

              <div className="form-group">
                <label htmlFor="role">Cargo</label>
                <select
                  id="role"
                  name="role"
                  value={user.role ?? ""}
                  onChange={handleRoleChange}
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="Trainee">Trainee</option>
                  <option value="Member">Membro</option>
                  <option value="Administrator">Administrador</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={user.status}
                  onChange={handleStatusChange}
                  required
                >
                  <option value="Active">Ativo</option>
                  <option value="Pending">Pendente</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="button button-primary"
                onClick={handleFormSubmit}
              >
                Atualizar Usuário
              </button>
            </div>
          </form>
        )}
      </DefaultContainer>
    </>
  );
};

export default UpdateUser;
