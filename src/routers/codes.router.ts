import { Router } from "express";
import { authorizeRequest, authorizeStaff } from "../helpers/authorization.helper.js";
import codesController from "../controllers/codes/codes.controller.js";

const codesRouter: Router = Router();

codesRouter.get('/', authorizeRequest, codesController.get);
codesRouter.get('/validate-code', authorizeStaff, codesController.validateCode);

export default codesRouter;