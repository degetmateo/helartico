declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGODB_DATABASE_KEY: string;

            DATABASE_URI: string;
            DATABASE_CA: string;

            PASSWORD_ROUNDS: number;

            JWT_KEY: string;
        }
    }
}

declare module 'express' {
    interface Request {
        member?: any;
    }
}

export {};