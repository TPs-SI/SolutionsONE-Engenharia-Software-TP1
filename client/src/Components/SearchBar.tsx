import React, { useEffect } from "react";
import "./Style/SearchBar.css";
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const SearchBar = ({updateItemSearch}: { updateItemSearch:Function}) => {

  const [search,setSearch] = React.useState("");
  useEffect(()=>{
    updateItemSearch(search);
  },[search]);

  return (
    <form onSubmit={(e) => { e.preventDefault(); }} className="search-bar">
      <i className="material-symbols-outlined search-icon">search</i>
      <input type="search" value={search} placeholder="Buscar" 
        onChange={(e)=>{
          setSearch(e.target.value);
        }}
        />
    </form>
  );
}

export default SearchBar