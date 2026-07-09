import { Router } from "express";
import membersController from "../controllers/members/members.controller.js";
import { authorizeStaff } from "../helpers/authorization.helper.js";

const membersRouter = Router();

membersRouter.get('/', authorizeStaff, membersController.get);

membersRouter.post('/signup', membersController.post);

membersRouter.put('/:_id/points/add', authorizeStaff, membersController.points.add);
membersRouter.put('/:_id/points/set', authorizeStaff, membersController.points.set);

export default membersRouter;