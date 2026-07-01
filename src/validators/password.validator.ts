import BaseError from "../errors/base.error.js";
import InvalidArgumentError from "../errors/invalidargument.error.js";

const passwordValidator = (password: string) => {
    try {
        if (password.length <= 1) throw new InvalidArgumentError('Contraseña demasiado corta.');
        if (password.length > 128) throw new InvalidArgumentError('Contraseña demasiado larga.');
    } catch (error) {
        console.error(error);
        if (error instanceof BaseError) throw error;
        else throw new InvalidArgumentError('Contrasña inválida.');
    };
};

export default passwordValidator;