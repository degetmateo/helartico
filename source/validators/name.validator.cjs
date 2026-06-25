const InvalidArgumentError = require("../errors/invalidargument.error.cjs");

const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ'\s]{2,50}$/;

module.exports = (name) => {
    const formatted = name.trim();
    if (!regexNombre.test(formatted)) throw new InvalidArgumentError('Nombre inválido.');
};