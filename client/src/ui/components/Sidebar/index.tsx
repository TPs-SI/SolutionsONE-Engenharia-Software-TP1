import React from "react";
import { Link, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

import pages from "../../routes/pages";

import "./styles.css";

const Sidebar = () => {
    const { pathname } = useLocation();

    return (
        <div className="sidebar">
            <div className="logo">
                <img src="../../../public/logo.png" alt="Solution One - Logo" />
            </div>

            <nav className="sidebar-options">
                {
                    pages
                        .filter(page => page.menuConfig !== undefined)
                        .map(page => (
                            <Link
                                to={page.link}
                                key={page.link}
                                className={pathname.includes(page.menuConfig!.keyword) ? "active" : ""}
                            >
                                <span className="icon">
                                    <FontAwesomeIcon icon={page.menuConfig!.icon}/>
                                </span>
                                <span className="text">{page.menuConfig?.displayName}</span>
                            </Link>
                        ))
                }
            </nav>

            <div className="user-profile">
                <div className="user-image">
                    <img src="../../../public/default-user.png" alt="Júlia" />
                </div>

                <div className="user-name">Júlia</div>

                {/* Ícone de configurações com link */}
                <Link to="/my-account" className="settings-icon" title="Minha conta">
                    <FontAwesomeIcon icon={faCog} />
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
