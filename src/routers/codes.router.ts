import { Router } from "express";
import { authorizeRequest } from "../helpers/authorization.helper.js";
import codesController from "../controllers/codes/codes.controller.js";

const codesRouter: Router = Router();

codesRouter.get('/', authorizeRequest, codesController.get);

export default codesRouter;