import productsControllerExchange from "./products.controller.exchange.js";
import productsControllerGet from "./products.controller.get.js";
import productsControllerPost from "./products.controller.post.js";

export const productsController = {
    get: productsControllerGet,
    exchange: productsControllerExchange,
    post: productsControllerPost
};