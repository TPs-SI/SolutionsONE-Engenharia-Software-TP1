import React from "react";

import "./styles.css"

interface DefaultContainerProps {
    children: React.ReactNode;
}

const DefaultContainer = ({ children }: DefaultContainerProps) => {
    return (
        <div className="default-container">
            {children}
        </div>
    );
}

export default DefaultContainer;