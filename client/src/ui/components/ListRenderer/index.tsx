import React from "react";

import "./styles.css"

interface ListRendererProps {
    children: React.ReactNode;
}

const ListRenderer = ({ children }: ListRendererProps) => {
    return (
        <div className="project-list">
            {children}
        </div>
    );
}

export default ListRenderer;