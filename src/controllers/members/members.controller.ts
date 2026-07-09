import membersControllerGet from "./member.controller.get.js";
import membersControllerPost from "./member.controller.post.js";
import membersControllerPointsAdd from "./members.controller.points.add.js";
import membersControllerPointsSet from "./members.controller.points.set.js";

const membersController = {
    get: membersControllerGet,
    post: membersControllerPost,
    points: {
        add: membersControllerPointsAdd,
        set: membersControllerPointsSet
    }
};

export default membersController;