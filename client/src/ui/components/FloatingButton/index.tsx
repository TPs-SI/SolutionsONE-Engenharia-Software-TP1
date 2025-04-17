import React from "react";

import "./styles.css"

interface FloatingButtonProps {
    text: string;
}

const FloatingButton = ({ text }: FloatingButtonProps) => {
    return (
        <button className="floating-button">
            {text}
        </button>
    );
}

export default FloatingButton;