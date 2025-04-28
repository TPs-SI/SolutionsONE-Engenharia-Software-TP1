import React from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faSearch, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import "./styles.css"

interface ListHeaderProps {
    title: string;
    icon: IconDefinition;
    onSearch: (query: string) => void;
}

const ListHeader = ({ title, icon, onSearch }: ListHeaderProps) => {
    return (
        <header className="list-header">
            <h1><FontAwesomeIcon icon={icon} />{title}</h1>
            <div className="search-bar">
                <FontAwesomeIcon icon={faSearch} />
                <input type="text" placeholder="" onChange={e => onSearch(e.target.value)} />
            </div>
        </header>
    );
}

export default ListHeader;