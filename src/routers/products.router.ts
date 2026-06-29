import { Router } from "express";
import { productsController } from "../controllers/products/products.controller.js";
import { authorizeRequest } from "../helpers/authorization.helper.js";

const productsRouter = Router();

productsRouter.get('/', authorizeRequest, productsController.get);

productsRouter.get('/exchange/:_id', authorizeRequest, productsController.exchange);

export default productsRouter;