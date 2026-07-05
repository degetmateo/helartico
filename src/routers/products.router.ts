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

productsRouter.put('/update/:_id/name', authorizeStaff, productsController.update.name);
productsRouter.put('/update/:_id/price', authorizeStaff, productsController.update.price);
productsRouter.put('/update/:_id/reward', authorizeStaff, productsController.update.reward);
productsRouter.put('/update/:_id/exchange', authorizeStaff, productsController.update.exchange);
productsRouter.put('/update/:_id/image', authorizeStaff, upload.single('image'), productsController.update.image);

export default productsRouter;