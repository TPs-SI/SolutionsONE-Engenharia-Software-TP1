import React from "react";

import "./styles.css"

interface FloatingButtonProps {
    text: string;
}

const FloatingButton = ({ text }: FloatingButtonProps) => {
    return (
        <button className="floating-button">
            <i className="fas fa-plus"></i>{text}
        </button>
    );
}

export default FloatingButton;