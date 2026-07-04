import { Router } from "express";
import { productsController } from "../controllers/products/products.controller.js";
import { authorizeRequest, authorizeStaff } from "../helpers/authorization.helper.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const productsRouter = Router();

productsRouter.get('/', authorizeRequest, productsController.get);

productsRouter.get('/exchange/:_id', authorizeRequest, productsController.exchange);

productsRouter.post('/', authorizeStaff, upload.single('product-image'), productsController.post);

productsRouter.post('/update/:_id/name', authorizeStaff, productsController.update.name);

export default productsRouter;