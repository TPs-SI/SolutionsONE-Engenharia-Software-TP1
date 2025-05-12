import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"; 
import { 
    LoginCredentials, LoginResponse, UserData,  ForgotPasswordDTO, ResetPasswordDTO, SuccessMessageResponse } from "../domain/models/auth";

export const BASE_URL = "http://localhost:3030/api/"

const api = axios.create({
    baseURL: BASE_URL,
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


/**
 * Envia solicitação para gerar token de recuperação de senha.
 * @param payload - Objeto contendo o email do usuário.
 * @returns Promise com a mensagem de sucesso genérica da API.
 */
export const requestPasswordReset = async (payload: ForgotPasswordDTO): Promise<SuccessMessageResponse> => {
    try {
        // Esta rota não precisa de token de autenticação
        const response = await api.post<SuccessMessageResponse>("/auth/forgot-password", payload);
        return response.data; 
    } catch (error) {
        console.error("Erro ao solicitar recuperação de senha:", error);
        throw new Error("Erro ao processar a solicitação.");
    }
};

/**
 * Envia o token de reset e a nova senha para a API.
 * @param token - O token recebido por email (geralmente da URL).
 * @param payload - Objeto contendo a nova senha e a confirmação.
 * @returns Promise com a mensagem de sucesso da API.
 */
export const resetPassword = async (token: string, payload: ResetPasswordDTO): Promise<SuccessMessageResponse> => {
    try {
        const response = await api.post<SuccessMessageResponse>(`/auth/reset-password/${token}`, payload);
        return response.data; 
    } catch (error) {
        console.error("Erro ao redefinir senha:", error);

        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<any>;
            const status = axiosError.response?.status;
            const responseData = axiosError.response?.data;

            if (status === 400 && responseData && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
                const validationErrorMessage = responseData.errors[0].msg; 
                throw new Error(validationErrorMessage || "Erro de validação nos dados enviados."); 
            } 
            else if (status === 400 || status === 401) {
                const apiErrorMessage = responseData?.error; 
                throw new Error(apiErrorMessage || "Token inválido ou expirado, ou as senhas não coincidem.");
            }
        }
        throw new Error("Erro ao tentar redefinir a senha.");
    }
};

export default api; 