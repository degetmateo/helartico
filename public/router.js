import CodesView from "./views/codes.view.js";
import ErrorView from "./views/error.view.js";
import HomeView from "./views/home.view.js";
import LandingView from "./views/landing.view.js";
import ProfileView from "./views/profile.view.js";
import SignInView from "./views/signin.view.js";
import SignUpView from "./views/signup.view.js";
import StaffValidateCodeView from "./views/staff.validate.code.view.js";
import StaffView from "./views/staff.view.js";
import WaitingView from "./views/waiting.view.js";

class Router {
    constructor () {
        this.router = new Navigo("/", { hash: true });
        this.event = new Event('pathnamechange');
        this.views = {};
    };

    init = () => {
        this.views = {
            landing: new LandingView(),
            error: new ErrorView(),
            signup: new SignUpView(),
            signin: new SignInView(),
            waiting: new WaitingView(),
            home: new HomeView(),
            profile: new ProfileView(),
            codes: new CodesView(),
            staff: new StaffView(),
            staff_validate_code: new StaffValidateCodeView()
        };

        this.router
            .on("/", () => this.views.landing.init())
            .on('/signup', () => this.views.signup.init())
            .on('/signup/waiting', () => this.views.waiting.init())
            .on('/signin', () => this.views.signin.init())
            .on('/home', () => this.views.home.init())
            .on('/profile', () => this.views.profile.init())
            .on('/codes', () => this.views.codes.init())
            .on('/staff', () => this.views.staff.init())
            .on('/staff/validate-code', () => this.views.staff_validate_code.init())
            .notFound(() => this.views.error.init());
    };

    goToNotFound () {
        this.views.error.init();
    };

    resolve = () => {
        this.router.resolve();
    };

    navigateTo = (url) => {
        if (url == window.location.pathname) return;
        window.history.pushState(null, null, url);
        window.dispatchEvent(this.event);
        this.resolve();
    };

    replace = (url) => {
        if (url == window.location.pathname) return;
        window.history.replaceState(null, null, url);
        window.dispatchEvent(this.event);
        this.resolve();
    };

    goBack = () => {
        window.history.back();
    };

    goForward = () => {
        window.history.forward();
    };

    getPathname = () => {
        return window.location.pathname;
    };

    reload = () => {
        window.location.reload();
    };
};

export default new Router();