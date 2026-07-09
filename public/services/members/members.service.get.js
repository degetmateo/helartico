import service from "../service.js";

const API = `/api/members?`;

const membersServiceGet = async (query = {
    dni
}) => {
    let requestUrl = API;
    if (query.dni) requestUrl += 'dni='+query.dni+'&';
    return await service.authorizedRequest(requestUrl);
};

export default membersServiceGet;