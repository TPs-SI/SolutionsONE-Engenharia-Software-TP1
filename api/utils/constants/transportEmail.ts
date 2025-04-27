import nodemailer from 'nodemailer';

// Validar se as variáveis de ambiente existem
if (
    !process.env.HOST_NODEMAILER ||
    !process.env.PORT_NODEMAILER ||
    !process.env.EMAIL_ACCOUNT ||
    !process.env.EMAIL_PASSWORD
) {
    console.error("Variáveis de ambiente do Nodemailer não configuradas!");
    // Poderia lançar um erro aqui para impedir a inicialização se o email for crítico
    // throw new Error("Configuração de email incompleta.");
}

// Criar o objeto transporter
export const transporter = nodemailer.createTransport({
    host: process.env.HOST_NODEMAILER,
    // Converter a porta para número aqui, com um fallback seguro
    port: parseInt(process.env.PORT_NODEMAILER || '587', 10), 
    secure: parseInt(process.env.PORT_NODEMAILER || '587', 10) === 465, // true para porta 465, false para outras (como 587)
    auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASSWORD,
    },
    // Adicionar configurações de TLS se necessário para o seu provedor (Gmail geralmente usa STARTTLS na 587)
    // tls: {
    //     ciphers:'SSLv3'
    // }
});

// Opcional: Verificar a conexão
transporter.verify(function(error, success) {
   if (error) {
        console.error("Erro na configuração do Nodemailer Transporter:", error);
   } else {
        console.log("Nodemailer Transporter configurado com sucesso. Pronto para enviar emails.");
   }
});