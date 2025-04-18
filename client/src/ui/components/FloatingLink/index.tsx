import React from "react";

import "./styles.css"
import { Link } from "react-router-dom";

interface FloatingLinkProps {
    text: string;
    link: string;
}

const FloatingLink = ({ text, link }: FloatingLinkProps) => {
    return (
        <Link to={link} className="floating-link">
            {text}
        </Link>
    );
}

export default FloatingLink;