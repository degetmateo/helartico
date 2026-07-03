import productsServiceGet from "./products/products.service.get.js";
import productsServiceUpdate from "./products/products.service.update.js";

const productsService = {
    get: productsServiceGet,
    update: productsServiceUpdate
};

export default productsService;