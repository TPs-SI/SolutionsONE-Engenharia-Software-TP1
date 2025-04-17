import React from "react";

import "./styles.css"

interface ListHeaderProps {
    title: string;
    onSearch: (query: string) => void;
}

const ListHeader = ({ title, onSearch }: ListHeaderProps) => {
    return (
        <header className="list-header">
            <h1><i className="fas fa-desktop"></i>{title}</h1>
            <div className="search-bar">
                <i className="fas fa-search"></i>
                <input type="text" placeholder="" onChange={e => onSearch(e.target.value)} />
            </div>
        </header>
    );
}

export default ListHeader;