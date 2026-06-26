import { Router } from "express";
import authController from "../controllers/auth/auth.controller.js";
import { authorizeRequest } from "../helpers/authorization.helper.js";

const authRouter = Router();

authRouter.post('/signin', authController.signIn);

authRouter.get('/resume', authorizeRequest, authController.resume);

export default authRouter;