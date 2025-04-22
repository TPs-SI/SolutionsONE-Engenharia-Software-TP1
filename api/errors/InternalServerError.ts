// api/errors/InternalServerError.ts
export class InternalServerError extends Error {
    constructor(message: string = "Ocorreu um erro interno no servidor.") {
        super(message);
        this.name = "InternalServerError";
        // Mantém o stack trace adequado para onde o erro foi lançado (apenas V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InternalServerError);
        }
    }
}