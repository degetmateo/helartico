import { Request, Response } from "express";
import InvalidArgumentError from "../../errors/invalidargument.error.js";
import dniValidator from "../../validators/dni.validator.js";
import nameValidator from "../../validators/name.validator.js";
import emailValidator from "../../validators/email.validator.js";
import passwordValidator from "../../validators/password.validator.js";
import { passwordHash } from "../../helpers/password.helper.js";
import { RESPONSES } from "../../static/responses.js";
import { responseError, responseOk } from "../../helpers/response.helper.js";
import membersRepository from "../../repository/members/members.repository.js";
import phoneValidator from "../../validators/phone.validator.js";

const membersControllerPost = async (req: Request, res: Response) => {
    try {
        let { dni, names, surnames, email, phone, password } = req.body;

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
        phoneValidator(phone);

        names = names.toUpperCase();
        surnames = surnames.toUpperCase();
        password = await passwordHash(password);

        const data = await membersRepository.post({ dni, names, surnames, email, password, phone });
        responseOk(res, RESPONSES.OK, data);
    } catch (error: any) {
        console.error(error);
        responseError(res, error);
    };
};

export default membersControllerPost;