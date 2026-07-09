import service from "../service.js";

const membersServicePointsSet = async (data = {
    _id,
    points
}) => {
    const requestUrl = `/api/members/${data._id}/points/set`;
    return await service.authorizedRequest(requestUrl, { 
        method: "PUT",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ points: data.points })
    });
};

export default membersServicePointsSet;