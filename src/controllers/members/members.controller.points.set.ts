import { Request, Response } from "express";
import { responseError, responseOk } from "../../helpers/response.helper.js";
import { RESPONSES } from "../../static/responses.js";
import InvalidArgumentError from "../../errors/invalidargument.error.js";
import { mongoDb } from "../../database/mongo.js";
import { UUID } from "mongodb";
import NotFoundError from "../../errors/notfound.error.js";

const membersControllerPointsSet = async (req: Request, res: Response) => {
    try {
        const _id = req.params._id as string;
        const points = Number(req.body.points);

        if (!_id) throw new InvalidArgumentError('ID is required.');
        if (!points) throw new InvalidArgumentError('POINTS are required.');
        if (isNaN(points)) throw new InvalidArgumentError('POINTS must be a number.');
        if (points < 0) throw new InvalidArgumentError('Un usuario no puede tener puntos negativos.');

        const members = mongoDb.collection('members');
        const member = await members.findOneAndUpdate({ _id: new UUID(_id) as any }, { $set: { points } });

        if (!member) throw new NotFoundError('No hemos encontrado el usuario solicitado.');

        responseOk(res, RESPONSES.ACCEPTED, {
            old_points: member.points,
            new_points: points
        });
    } catch (error: any) {
        console.error(error);
        responseError(res, error);
    };
};

export default membersControllerPointsSet;