const { UUID } = require("mongodb");
const mongo = require("../../database/mongo.cjs");
const InvalidArgumentError = require("../../errors/invalidargument.error.cjs");
const { UnauthorizedError } = require("../../errors/unauthorized.error.cjs");
const { generateToken } = require("../../helpers/jwt.cjs");
const { compare } = require("../../helpers/password.cjs");
const { responseError, responseOk } = require("../../helpers/response.helper.cjs");
const { userRepositoryGetByEmail } = require("../../repository/user/user.repository.getbyemail.cjs");
const responses = require("../../static/responses.cjs");
const emailValidator = require("../../validators/email.validator.cjs");

module.exports.authControllerSignIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !email.trim()) throw new InvalidArgumentError('Tenés que ingresar un correo electrónico.');
        if (!password || !password.trim()) throw new InvalidArgumentError('Tenés que ingresar tu contraseña.');

        emailValidator(email);

        const member = await userRepositoryGetByEmail(email);

        if (!member) throw new UnauthorizedError('Las credenciales no coinciden.');
        if (!(await compare(password, member.password))) throw new UnauthorizedError('Las credenciales no coinciden.');

        const token = await generateToken({ id: member.id, dni: member.dni, email: member.email }, '30d');

        const c = mongo.db.collection('users');
        const publicMember = await c.findOne({ _id: new UUID(member.id) });

        const data = {
            token,
            member: {
                id: member.id,
                names: member.names,
                surnames: member.surnames,
                points: publicMember.points
            }
        };

        responseOk(res, responses.ACCEPTED, data);
    } catch (error) {
        console.error(error);
        responseError(res, error);
    };
};