import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3030/api",
    withCredentials: true,
});

// Retorna um usuário pelo ID
export const getUserById = async (userId: number) => {
    const response = await api.get(`/users/admin/member/read/${userId}`);
    return response.data;
};

// Atualiza os dados de um usuário
export const updateUser = async (
    userId: number,
    userData: {
        email: string;
        name: string;
        cellphone: string;
        birth: string;
        status: string;
        role: string | null;
  }
) => {
  try {
        const response = await api.put(`/users/admin/update/${userId}`, userData);
        return response.data;
  } catch (error) {
        console.error(error);
        throw new Error("Erro ao atualizar usuário.");
    }
};

// Cria um novo usuário
export const createUser = async (userData: {
    email: string;
    name: string;
    password: string;
    cellphone: string;
    birth: string;
    status: string | null;
    role: string | null;
}) => {
  const response = await api.post("/users/create", userData);
  return response.data;
};

// Retorna todos os usuários
export const getAllUsers = async () => {
  const response = await api.get("/users/");
  return response.data;
};

export default api;