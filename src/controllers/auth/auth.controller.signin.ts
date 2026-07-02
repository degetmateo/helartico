import { Request, Response } from "express";
import InvalidArgumentError from "../../errors/invalidargument.error.js";
import emailValidator from "../../validators/email.validator.js";
import membersRepository from "../../repository/members/members.repository.js";
import UnauthorizedError from "../../errors/unauthorized.error.js";
import { passwordCompare } from "../../helpers/password.helper.js";
import { generateMemberToken, generateToken } from "../../helpers/jwt.helper.js";
import { mongoDb } from "../../database/mongo.js";
import { UUID } from "mongodb";
import { responseError, responseOk } from "../../helpers/response.helper.js";
import { RESPONSES } from "../../static/responses.js";

const authControllerSignIn = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !email.trim()) throw new InvalidArgumentError('Tenés que ingresar un correo electrónico.');
        if (!password || !password.trim()) throw new InvalidArgumentError('Tenés que ingresar tu contraseña.');

        emailValidator(email);

        const member = await membersRepository.getByEmail(email);

        if (!member) throw new UnauthorizedError('Las credenciales no coinciden.');
        if (!(await passwordCompare(password, member.password))) throw new UnauthorizedError('Las credenciales no coinciden.');

        const token = await generateMemberToken({ _id: member._id, dni: member.dni, email: member.email, role: member.role });

        const c = mongoDb.collection('members');
        const publicMember: any = await c.findOne({ _id: new UUID(member._id) as any });

        const data = {
            token,
            member: {
                _id: member._id,
                names: publicMember.names,
                surnames: publicMember.surnames,
                points: publicMember.points,
                role: member.role
            }
        };

        responseOk(res, RESPONSES.ACCEPTED, data);
    } catch (error: any) {
        console.error(error);
        responseError(res, error);
    };
};

export default authControllerSignIn;