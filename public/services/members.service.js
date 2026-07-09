import membersServiceGet from "./members/members.service.get.js";
import membersServicePointsAdd from "./members/members.service.points.add.js";
import membersServicePointsSet from "./members/members.service.points.set.js";

const membersService = {
    get: membersServiceGet,
    points: {
        add: membersServicePointsAdd,
        set: membersServicePointsSet
    }
};

export default membersService;