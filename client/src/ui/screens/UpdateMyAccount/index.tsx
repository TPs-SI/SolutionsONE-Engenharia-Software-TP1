import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
}

const UpdateMyAccount = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { data } = await api.get<User>("/users/account");
      setUser(data);
    } catch (err) {
      alert("Erro ao carregar dados da conta.");
      navigate("/users");
    }
  };

  const handleFormSubmit = async () => {
    if (!user) return;

    if (!user.name || !user.email || !user.cellphone || !user.birth) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const payload = {
      ...user,
      password: password || undefined,
    };

    try {
      await api.put(`/users/account/updateAccount`, payload);
      alert("Conta atualizada com sucesso.");
      navigate("/my-account");
    } catch (error) {
      alert("Erro ao atualizar conta.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  return (
    <>
      <Sidebar />

      <DefaultContainer>
        <header className="create-header">
          <h1>
            <FontAwesomeIcon icon={faEdit} /> Editar Minha Conta
          </h1>
        </header>

        {user && (
          <form className="account-container">
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
                  type="email"
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
                  type="date"
                  id="birth"
                  name="birth"
                  value={user.birth}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Nova Senha</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Preencha para alterar a senha"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="button button-primary"
                onClick={handleFormSubmit}
              >
                Atualizar Conta
              </button>
            </div>
          </form>
        )}
      </DefaultContainer>
    </>
  );
};

export default UpdateMyAccount;
