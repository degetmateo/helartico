import productsServiceGet from "./products/products.service.get.js";
import productsServiceUpdateExchange from "./products/products.service.update.exchange.js";
import productsServiceUpdateImage from "./products/products.service.update.image.js";
import productsServiceUpdateName from "./products/products.service.update.name.js";
import productsServiceUpdatePrice from "./products/products.service.update.price.js";
import productsServiceUpdateReward from "./products/products.service.update.reward.js";

const productsService = {
    get: productsServiceGet,
    update: {
        name: productsServiceUpdateName,
        price: productsServiceUpdatePrice,
        reward: productsServiceUpdateReward,
        exchange: productsServiceUpdateExchange,
        image: productsServiceUpdateImage
    }
};

export default productsService;