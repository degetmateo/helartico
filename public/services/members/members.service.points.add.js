import service from "../service.js";

const membersServicePointsAdd = async (data = {
    _id,
    points
}) => {
    const requestUrl = `/api/members/${data._id}/points/add`;
    return await service.authorizedRequest(requestUrl, {
        method: "PUT",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ points: data.points })
    });
};

export default membersServicePointsAdd;