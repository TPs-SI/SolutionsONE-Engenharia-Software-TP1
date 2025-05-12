import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

import pages from "../../routes/pages";
import api from "../../../Services/api";

import "./styles.css";

interface User {
  name: string;
  photo: string;
}

const Sidebar = () => {
  const { pathname } = useLocation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { data } = await api.get<User>("/users/account");
      setUser(data);
    } catch (error) {
      console.error("Erro ao carregar usuário do Sidebar.");
    }
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <img src="../../../public/logo.png" alt="Solution One - Logo" />
      </div>

      <nav className="sidebar-options">
        {pages
          .filter((page) => page.menuConfig !== undefined)
          .map((page) => (
            <Link
              to={page.link}
              key={page.link}
              className={
                pathname.includes(page.menuConfig!.keyword) ? "active" : ""
              }
            >
              <span className="icon">
                <FontAwesomeIcon icon={page.menuConfig!.icon} />
              </span>
              <span className="text">{page.menuConfig?.displayName}</span>
            </Link>
          ))}
      </nav>

      <div className="user-profile">
        <div className="user-image">
          <img
            src={
              user?.photo ||
              "https://img.freepik.com/vetores-premium/ilustracao-em-vetor-de-icone-de-perfil-de-usuario-masculino-padrao_276184-168.jpg?w=900"
            }
            alt={user?.name || "Usuário"}
          />
        </div>

        <div className="user-name">{user?.name || "Usuário"}</div>

        {/* Ícone de configurações com link */}
        <Link to="/my-account" className="settings-icon" title="Minha conta">
          <FontAwesomeIcon icon={faCog} />
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
