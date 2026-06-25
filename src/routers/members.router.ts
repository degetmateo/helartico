import { Router } from "express";
import membersController from "../controllers/members/members.controller.js";

const membersRouter = Router();

membersRouter.post('/signup', membersController.post);

export default membersRouter;