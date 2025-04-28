import React from "react";

import "./styles.css"
import { Link } from "react-router-dom";

interface ListItemProps {
    title: string;
    subtitle: string;
    link: string;
}

const ListItem = ({ title, subtitle, link }: ListItemProps) => {
    return (
        <Link to={link} className="list-item">
            <span className="list-item-title">{title}</span>
            <span className="list-item-subtitle">{subtitle}</span>
        </Link>
    );
}

export default ListItem;