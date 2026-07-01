import InvalidArgumentError from "../errors/invalidargument.error.js";

const regex: RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const emailValidator = (email: string) => {
    try {
        const formatted = email.trim();
        if (!regex.test(formatted)) throw new InvalidArgumentError();
        const parts = formatted.split('@');
        const domain = parts[1];
        if (!(domain.includes('.') && (domain.split('.').pop() as any).length >= 2)) throw new InvalidArgumentError();
        if (email.length > 128) throw new InvalidArgumentError('Correo electrónico demasiado largo.');
    } catch (error) {
        console.error(error);
        throw new InvalidArgumentError('Correo electrónico inválido.');
    };
};

export default emailValidator;