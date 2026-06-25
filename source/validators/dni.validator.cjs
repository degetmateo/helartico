const InvalidArgumentError = require("../errors/invalidargument.error.cjs");

const regexDNI = /^\d{7,8}$/;

module.exports = (dni) => {
    const formatted = dni.toString().replace(/\D/g, '');
    if (!regexDNI.test(formatted)) throw new InvalidArgumentError('Número de documento inválido.');
};