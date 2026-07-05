import service from "../service.js";

const productsServiceUpdateReward = async (_id, reward) => {
    const url = `/api/products/update/${_id}/reward`;
    const options = {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reward })
    };
    return await service.authorizedRequest(url, options);
};

export default productsServiceUpdateReward;