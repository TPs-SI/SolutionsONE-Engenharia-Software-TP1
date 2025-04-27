import { transporter } from '../constants/transportEmail';
// Importar o tipo de erro apropriado se TokenError não existir
// import { Error } from '../../errors/Error'; // Exemplo genérico

interface EmailInfo {
    email: string; // Destinatário
    token: string; // Token de reset (RAW)
    userName?: string; // Opcional: Nome do usuário para personalizar email
}

// Função para enviar o email de recuperação de senha
export async function sendPasswordResetEmail(info: EmailInfo): Promise<boolean> {
    // Construir a URL do frontend para resetar a senha
    // Garanta que APP_URL no .env esteja correto (http://localhost:5173)
    const frontendResetUrl = `${process.env.APP_URL || 'http://localhost:5173'}/new-password/${info.token}`;

    const message = {
        from: `"Solutions ONE" <${process.env.EMAIL_ACCOUNT}>`, // Nome do remetente e email
        to: info.email,                                         // Destinatário
        subject: 'Recuperação de Senha - Solutions ONE',        // Assunto
        // Corpo em texto plano (fallback)
        text: `Olá ${info.userName || ''}!\n\nVocê solicitou a redefinição de senha para sua conta na Solutions ONE.\n\nUse o seguinte token (ou clique no link) para criar uma nova senha: ${info.token}\n\nLink para redefinir senha: ${frontendResetUrl}\n\nEste link expirará em 1 hora.\n\nSe você não solicitou isso, por favor ignore este email.\n\nObrigado,\nEquipe Solutions ONE`,
        // Corpo em HTML (mais bonito)
        html: `
            <p>Olá ${info.userName || ''}!</p>
            <p>Você solicitou a redefinição de senha para sua conta na Solutions ONE.</p>
            <p>Por favor, clique no link abaixo para criar uma nova senha:</p>
            <p><a href="${frontendResetUrl}" target="_blank" style="background-color: #64ffda; color: #0a192f; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-weight: bold;">Redefinir Senha</a></p>
            <p>Ou use o seguinte token na página de redefinição: <strong>${info.token}</strong></p>
            <p><em>Este link (e o token) expirará em 1 hora.</em></p>
            <p>Se você não solicitou esta redefinição, por favor ignore este email.</p>
            <br>
            <p>Obrigado,</p>
            <p>Equipe Solutions ONE</p>
        `
    };

    try {
        console.log(`Tentando enviar email de reset para: ${info.email}`);
        const infoEnvio = await transporter.sendMail(message);
        console.log("Email enviado com sucesso: %s", infoEnvio.messageId);
        return true;
    } catch (error) {
        console.error(`Erro ao enviar email para ${info.email}:`, error);
        // Lançar um erro específico ou retornar false pode ser útil
        throw new Error('Falha ao enviar o email de recuperação.');
    }
}