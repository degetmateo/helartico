import service from "../service.js";

const productsServiceUpdatePrice = async (_id, price) => {
    const url = `/api/products/update/${_id}/price`;
    const options = {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ price })
    };
    return await service.authorizedRequest(url, options);
};

export default productsServiceUpdatePrice;