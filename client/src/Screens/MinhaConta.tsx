import { useEffect, useState } from "react";
import api from "../Services/api";
import "./Style/MinhaConta.css";
import NavbarIcon from "../Components/NavbarIcon";
import { useNavigate } from "react-router-dom";

interface IDadosUsuario {
  nome: string;
  email: string;
  foto: string;
  celular: string;
  nascimento: string;
}

const MinhaConta = () => {
  const [dadosUsuario, setDadosUsuario] = useState<IDadosUsuario | null>(null);
  const navigate = useNavigate();

  const handleEditar = () => {
    navigate('/minha-conta/edit');
  };

  useEffect(() => {
    // Faz a chamada para obter os dados do usuário logado
    api
      .get("/users/account")
      .then((response) => {
        const { name, email, photo, cellphone, birth } = response.data;
        setDadosUsuario({
          nome: name,
          email,
          foto: photo,
          celular: cellphone,
          nascimento: birth,
        });
      })
      .catch((err) => {
        console.error("Erro ao buscar dados do usuário: ", err);
      });
  }, []);

  if (!dadosUsuario) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="minha-conta">
      <NavbarIcon />
      <h1 className="list-title">Meus dados</h1>
      <div className="mydata-container">
        <i className="material-symbols-outlined" id="edit-icon" onClick={handleEditar}>
          edit_square
        </i>
        <div className="mydata-info">
          <div className="image-name-container">
            <img
              src={dadosUsuario.foto || "https://placehold.jp/150x150.png"}
              alt="Sua foto"
              className="my-img"
            />
            <h3 className="myuser-name">{dadosUsuario.nome}</h3>
          </div>
          <div className="other-data-container">
            <div className="other-data">
              <h4 className="myuser-category">
                <i className="material-symbols-outlined" id="email-icon">
                  mail
                </i>
                Email:
              </h4>
              <p className="myuser-info">{dadosUsuario.email}</p>
            </div>
            <div className="other-data">
              <h4 className="myuser-category">
                <i className="material-symbols-outlined" id="cellphone-icon">
                  call
                </i>
                Celular:
              </h4>
              <p className="myuser-info">{dadosUsuario.celular}</p>
            </div>
            <div className="other-data">
              <h4 className="myuser-category">
                <i className="material-symbols-outlined" id="calendar-icon">
                  date_range
                </i>
                Data de nascimento:
              </h4>
              <p className="myuser-info">{dadosUsuario.nascimento}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinhaConta;
