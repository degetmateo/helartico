import authControllerResume from "./auth.controller.resume.js";
import authControllerSignIn from "./auth.controller.signin.js";

const authController = {
    signIn: authControllerSignIn,
    resume: authControllerResume
};

export default authController;