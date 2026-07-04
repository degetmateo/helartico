import service from "../service.js";

const productsServiceUpdateName = async (_id, name) => {
    const url = `/api/products/update/${_id}/name`;
    const options = {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name })
    };
    return await service.authorizedRequest(url, options);
};

export default productsServiceUpdateName;