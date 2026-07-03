import service from "../service.js";

const API_URL = '/api/products?';

const productsServiceGet = async (query = {
    _id,
    name,
    olderId
}) => {
    let requestUrl = API_URL;
    if (query._id) requestUrl += '_id='+query._id+'&';
    if (query.name) requestUrl += 'name='+query.name+'&';
    if (query.olderId) requestUrl += 'older_id='+query.olderId+'&';
    return await service.authorizedRequest(requestUrl);
};

export default productsServiceGet;