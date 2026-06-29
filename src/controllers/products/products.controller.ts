import productsControllerExchange from "./products.controller.exchange.js";
import productsControllerGet from "./products.controller.get.js";

export const productsController = {
    get: productsControllerGet,
    exchange: productsControllerExchange
};