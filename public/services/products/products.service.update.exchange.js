import service from "../service.js";

const productsServiceUpdateExchange = async (_id, exchange) => {
    const url = `/api/products/update/${_id}/exchange`;
    const options = {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ exchange })
    };
    return await service.authorizedRequest(url, options);
};

export default productsServiceUpdateExchange;