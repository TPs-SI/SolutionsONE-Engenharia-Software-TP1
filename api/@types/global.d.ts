import { Usuario } from "@prisma/client";

declare global {
    namespace Express {
        interface Request {
            user: Usuario
        }
    }
    namespace NodeJS{
        interface ProcessEnv{
            DATABASE_URL : string,
            PORT : string,
            APP_URL : string,
        }
    }
}