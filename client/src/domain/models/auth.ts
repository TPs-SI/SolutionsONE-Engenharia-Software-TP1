// Tipos para o payload de login
export interface LoginCredentials {
    email: string;
    password: string;
}

// Tipo para a resposta esperada da API de login
export interface LoginResponse {
    token: string;
}

// Interface básica para dados do usuário (adapte conforme necessário)
export interface UserData {
    id: number;
    name: string;
    email: string;
    role?: string | null;
    // Adicione outros campos retornados pela API que você usa
}

export interface ForgotPasswordDTO {
    email: string;
}

export interface ResetPasswordDTO {
    newPassword: string;
    confirmPassword: string;
    // O token virá pela URL, não pelo corpo geralmente
}

export interface SuccessMessageResponse {
    message: string;
}