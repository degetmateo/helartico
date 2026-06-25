const InvalidArgumentError = require("../../errors/invalidargument.error.cjs");
const { hash } = require("../../helpers/password.cjs");
const { responseError, responseOk } = require("../../helpers/response.helper.cjs");
const { userRepository } = require("../../repository/user/user.repository.cjs");
const responses = require("../../static/responses.cjs");
const dniValidator = require("../../validators/dni.validator.cjs");
const emailValidator = require("../../validators/email.validator.cjs");
const nameValidator = require("../../validators/name.validator.cjs");
const passwordValidator = require("../../validators/password.validator.cjs");

module.exports.userControllerPost = async (req, res) => {
    try {
        let { dni, names, surnames, email, password } = req.body;

        if (!dni || !dni.trim()) throw new InvalidArgumentError('Tenés que ingresar tu número de documento.');
        if (!names || !names.trim()) throw new InvalidArgumentError('Tenés que ingresar tu nombre.');
        if (!surnames || !surnames.trim()) throw new InvalidArgumentError('Tenés que ingresar tu apellido.');
        if (!email || !email.trim()) throw new InvalidArgumentError('Tenés que ingresar tu correo electrónico.');
        if (!password || !password.trim()) throw new InvalidArgumentError('Tenés que ingresar tu contraseña.'); 

        dniValidator(dni);
        nameValidator(names);
        nameValidator(surnames);
        emailValidator(email);
        passwordValidator(password);

        names = names.toUpperCase();
        surnames = surnames.toUpperCase();
        password = await hash(password);

        const data = await userRepository.post({ dni, names, surnames, email, password });
        responseOk(res, responses.OK, data);
    } catch (error) {
        console.error(error);
        responseError(res, error);
    };
};