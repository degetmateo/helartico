import BaseError from "../errors/base.error.js";
import InvalidArgumentError from "../errors/invalidargument.error.js";

const cleanedRegex: RegExp = /[\s\-\(\)]/g;
// const phoneRegex: RegExp = /^\+[1-9]\d{1,14}$/;

const phoneValidator = (phone: string) => {
    try {
        if (!phone || !phone.trim()) throw new InvalidArgumentError('Tenés que ingresar tu número de celular.');
        phone = phone.replace(cleanedRegex, '');
        if (phone.length > 32) throw new InvalidArgumentError('Número de celular demasiado largo.');
        // if (!phoneRegex.test(phone)) throw new InvalidArgumentError('El número de celular que ingresaste no es correcto.');
    } catch (error) {
        if (error instanceof BaseError) throw error;
        else throw new InvalidArgumentError('El número de celular que ingresaste no es correcto.');
    };
};

export default phoneValidator;