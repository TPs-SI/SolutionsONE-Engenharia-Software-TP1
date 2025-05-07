import { JwtPayload } from "../src/domains/Auth/services/AuthService";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
    namespace NodeJS{
        interface ProcessEnv{
            DATABASE_URL : string,
            PORT : string,
            APP_URL : string,
            SECRET_KEY: string;
            JWT_EXPIRATION: string;
            HOST_NODEMAILER : string;
            PORT_NODEMAILER : string;
            EMAIL_ACCOUNT : string;
            EMAIL_PASSWORD : string;
        }
    }
}

export {};