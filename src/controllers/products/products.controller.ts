import productsControllerExchange from "./products.controller.exchange.js";
import productsControllerGet from "./products.controller.get.js";
import productsControllerPost from "./products.controller.post.js";
import productsControllerUpdateExchange from "./products.controller.update.exchange.js";
import productsControllerUpdateImage from "./products.controller.update.image.js";
import productsControllerUpdateName from "./products.controller.update.name.js";
import productsControllerUpdatePrice from "./products.controller.update.price.js";
import productsControllerUpdateReward from "./products.controller.update.reward.js";

export const productsController = {
    get: productsControllerGet,
    exchange: productsControllerExchange,
    post: productsControllerPost,
    update: {
        name: productsControllerUpdateName,
        price: productsControllerUpdatePrice,
        reward: productsControllerUpdateReward,
        exchange: productsControllerUpdateExchange,
        image: productsControllerUpdateImage
    }
};