import service from "../service.js";

const productsServiceUpdateImage = async (_id, image) => {
    const url = `/api/products/update/${_id}/image`;

    const formData = new FormData();
    formData.append('image', image);

    const options = {
        method: "PUT",
        body: formData
    };
    
    return await service.authorizedRequest(url, options);
};

export default productsServiceUpdateImage;