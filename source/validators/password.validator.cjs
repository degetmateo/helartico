const InvalidArgumentError = require("../errors/invalidargument.error.cjs");

module.exports = (password) => {
    if (password.length <= 1) throw new InvalidArgumentError('Contraseña demasiado corta.');
};