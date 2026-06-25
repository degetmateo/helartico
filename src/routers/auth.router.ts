import { Router } from "express";
import authController from "../controllers/auth/auth.controller.js";

const authRouter = Router();

authRouter.post('/signin', authController.signIn);

export default authRouter;