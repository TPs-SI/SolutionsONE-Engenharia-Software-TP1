import React from "react";
import { Link, useLocation } from "react-router-dom";

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
                                    <i className={page.menuConfig?.icon}></i>
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
                <div className="settings-icon">
                    <i className="fas fa-cog"></i>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;