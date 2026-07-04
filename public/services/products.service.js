import productsServiceGet from "./products/products.service.get.js";
import productsServiceUpdateName from "./products/products.service.update.name.js";

const productsService = {
    get: productsServiceGet,
    update: {
        name: productsServiceUpdateName
    }
};

export default productsService;