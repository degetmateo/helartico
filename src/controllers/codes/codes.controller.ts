import codesControllerGet from "./codes.controller.get.js";
import codesControllerValidateCode from "./codes.controller.validateCode.js";

const codesController = {
    get: codesControllerGet,
    validateCode: codesControllerValidateCode
};

export default codesController;