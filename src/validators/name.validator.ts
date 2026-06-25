import InvalidArgumentError from "../errors/invalidargument.error.js";

const regexNombre: RegExp = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ'\s]{2,50}$/;

const nameValidator = (name: string) => {
    try {
        const formatted = name.trim();
        if (!regexNombre.test(formatted)) throw new InvalidArgumentError();
    } catch (error) {
        console.error(error);
        throw new InvalidArgumentError('Nombre inválido.');
    };
};

export default nameValidator;