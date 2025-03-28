/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/Usuario.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../Services/api";
import "./Style/Usuario.css";
import NavbarIcon from "../Components/NavbarIcon";

interface IUsuario {
  id: number;
  email: string;
  nome: string;
  foto: string;
  celular: string;
  nascimento: string;
  status: string;
  cargo: string | null;
  projetos: unknown[];
}

const Usuario = () => {
  const { id } = useParams<{ id: string }>();
  const [usuario, setUsuario] = useState<IUsuario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const buscarUsuario = async () => {
      try {
        const usuarioData = await getUserById(Number(id));
        setUsuario(usuarioData);
        setLoading(false);
      } catch (error) {
        setError("Erro ao carregar usuário.");
        setLoading(false);
      }
    };

    buscarUsuario();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUsuario((prevUsuario) =>
      prevUsuario ? { ...prevUsuario, [name]: value } : null
    );
  };

  const handleCargoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUsuario((prevUsuario) =>
      prevUsuario ? { ...prevUsuario, cargo: value } : null
    );
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUsuario((prevUsuario) =>
      prevUsuario ? { ...prevUsuario, status: value } : null
    );
  };

  const handleSave = async () => {
    if (usuario) {
      try {
        const dadosParaAtualizar = {
          email: usuario.email,
          name: usuario.nome,
          cellphone: usuario.celular,
          birth: usuario.nascimento,
          status: usuario.status,
          role: usuario.cargo,
        };
  
        await updateUser(Number(id), dadosParaAtualizar);
        navigate(`/usuarios`);
        window.location.reload();
      } catch (error) {
        setError("Erro ao salvar alterações.");
      }
    }
  };
  
  const formatarCelular = (valor: string | null) => {
    if (!valor) return "";
    return valor
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d)(\d{4})$/, "$1-$2");
  };

  const formatarNascimento = (valor: string | null) => {
    if (!valor) return "";
    return valor
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{2})(\d{4})$/, "$1/$2");
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="usuario-screen">
      <div className="nav-icon">
        <NavbarIcon />
      </div>
      <h1>Editar Usuário</h1>
      {usuario && (
        <div className="usuario-container">
          <div className="usuario-top">
            <div className="usuario-left">
              <div className="usuario-left-img">
                <img
                  src={usuario.foto}
                  alt="imagem usuário"
                  className="usuario-img"
                />
              </div>
              <div className="usuario-left-bottom">
                <div className="cargo">
                  <h2>Cargo</h2>
                  <label>
                    <input
                      type="checkbox"
                      value="Trainee"
                      checked={usuario.cargo === "Trainee"}
                      onChange={handleCargoChange}
                    />
                    Trainee
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="Member"
                      checked={usuario.cargo === "Member"}
                      onChange={handleCargoChange}
                    />
                    Membro
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="Administrator"
                      checked={usuario.cargo === "Administrator"}
                      onChange={handleCargoChange}
                    />
                    Administrador
                  </label>
                </div>
                <div className="status">
                  <h2>Status</h2>
                  <label>
                    <input
                      type="radio"
                      value="Active"
                      checked={usuario.status === "Active"}
                      onChange={handleStatusChange}
                    />
                    Ativo
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="Pending"
                      checked={usuario.status === "Pending"}
                      onChange={handleStatusChange}
                    />
                    Pendente
                  </label>
                </div>
              </div>
            </div>
            <div className="usuario-right">
              <div className="usuario-right-top">
                <div className="usuario-input" id="input-left">
                  <h2>Nome</h2>
                  <input
                    type="text"
                    name="nome"
                    placeholder="Nome do usuário"
                    value={usuario.nome}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="usuario-input" id="input-right">
                  <h2>Data de nascimento</h2>
                  <input
                    type="text"
                    minLength={10}
                    maxLength={10}
                    name="nascimento"
                    value={formatarNascimento(usuario.nascimento)}
                    onChange={(e) =>
                      setUsuario((prevUsuario) =>
                        prevUsuario
                          ? { ...prevUsuario, nascimento: e.target.value }
                          : null
                      )
                    }
                  />
                </div>
              </div>
              <div className="usuario-input">
                <h2>Email</h2>
                <input
                  type="text"
                  name="email"
                  placeholder="email@usuario.com"
                  value={usuario.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="usuario-input">
                <h2>Celular</h2>
                <input
                  type="text"
                  minLength={15}
                  maxLength={15}
                  name="celular"
                  placeholder="(31)98765-4321"
                  value={formatarCelular(usuario.celular)}
                  onChange={(e) =>
                    setUsuario((prevUsuario) =>
                      prevUsuario
                        ? {
                            ...prevUsuario,
                            celular: formatarCelular(e.target.value),
                          }
                        : null
                    )
                  }
                />
              </div>
              {/*
                A seção de GitHub foi removida conforme solicitado.
              */}
            </div>
          </div>
          <button className="save-btn" onClick={handleSave}>
            Salvar alterações
          </button>
          <button className="change-btn">Alterar senha</button>
        </div>
      )}
    </div>
  );
};

export default Usuario;
