import InvalidArgumentError from "../errors/invalidargument.error.js";

const regexDNI: RegExp = /^\d{7,8}$/;

const dniValidator = (dni: string) => {
    try {
        const formatted = dni.toString().replace(/\D/g, '');
        if (!regexDNI.test(formatted)) throw new InvalidArgumentError();
        if (dni.length > 128) throw new InvalidArgumentError('Número de documento demasiado largo.');
    } catch (error) {
        throw new InvalidArgumentError('Número de documento inválido.');
    };
};

export default dniValidator;