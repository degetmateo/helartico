const InvalidArgumentError = require("../errors/invalidargument.error.cjs");

const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

module.exports = (email) => {
    const formatted = email.trim();
    if (!regex.test(formatted)) throw new InvalidArgumentError('Correo electrónico inválido.');
    const parts = formatted.split('@');
    const domain = parts[1];
    if (!(domain.includes('.') && domain.split('.').pop().length >= 2)) throw new InvalidArgumentError('Correo electrónico inválido.');
};