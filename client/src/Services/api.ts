import axios, { InternalAxiosRequestConfig } from "axios"; 
import { LoginCredentials, LoginResponse, UserData } from "../domain/models/auth";

const api = axios.create({
    baseURL: "http://localhost:3030/api",
    // withCredentials: true, 
});

// *** ADICIONAR INTERCEPTOR DE REQUISIÇÃO AQUI ***
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = localStorage.getItem('authToken');

        if (token) {
            config.headers = config.headers || {}; 
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Interceptor: Token adicionado ao header Authorization.'); 
        } else {
            console.log('Interceptor: Nenhum token encontrado no localStorage.'); 
        }
        
        return config;
    },
    (error) => {
        console.error('Erro no interceptor de requisição do Axios:', error);
        return Promise.reject(error);
    }
);

// --- FUNÇÕES DE API  ---

// Retorna um usuário pelo ID
export const getUserById = async (userId: number): Promise<UserData> => {
  const response = await api.get(`/users/admin/member/read/${userId}`);
  return response.data;
};

// Atualiza os dados de um usuário
export const updateUser = async (userId: number, userData: Partial<UserData>): Promise<UserData> => {
  try {
        const response = await api.put(`/users/admin/update/${userId}`, userData);
        return response.data;
  } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        throw new Error("Erro ao atualizar usuário.");
    }
};

// Cria um novo usuário
export const createUser = async (userData: Partial<UserData>): Promise<UserData> => {
  const response = await api.post("/users/create", userData);
  return response.data;
};

// Retorna todos os usuários
export const getAllUsers = async (): Promise<UserData[]> => {
  const response = await api.get("/users/");
  return response.data;
};

/**
 * Envia as credenciais de login para a API.
 * @param credentials - Objeto contendo email e password.
 * @returns Promise com a resposta da API (espera-se { token: string }).
 */
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
      const response = await api.post<LoginResponse>("/auth/login", credentials);
      return response.data;
  } catch (error) {
      console.error("Erro no login:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
          throw new Error("Email ou senha inválidos.");
      }
      throw new Error("Erro ao tentar fazer login.");
  }
};

export default api; 