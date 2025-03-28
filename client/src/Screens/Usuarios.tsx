import { useEffect, useState } from "react";
import { getAllUsers } from "../Services/api"; 
import List from "../Components/List";

interface IUsuario {
  id: number;
  email: string;
  nome: string;
  foto: string;
  celular: string;
  nascimento: string;
  status: string;
  cargo: string | null;
  projetos: unknown[];
}

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);

  useEffect(() => {
    const buscarUsuarios = async () => {
      try {
        const dadosUsuarios = await getAllUsers();
        setUsuarios(dadosUsuarios);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    buscarUsuarios();
  }, []);

  return (
    <List
      title="Usuários"
      headers={["Nome", "Email", "Status", "Cargo"]}
      items={usuarios}
      showAddButton={false}
    />
  );
};

export default Usuarios;
