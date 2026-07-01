import router from "../router.js";
import landingViewStyles from "../styles/views/landing.view.styles.js";
import landingViewTemplate from "../templates/views/landing.view.template.js";
import BaseView from "./base.view.js";

export default class LandingView extends BaseView {
    constructor () {
        super();
        this.view.innerHTML = landingViewTemplate()+landingViewStyles();

        this.view.querySelector('#landing-button-signup').addEventListener('click', (event) => {
            router.navigateTo('/signup');
        });

        this.view.querySelector('#landing-button-signin').addEventListener('click', (event) => {
            router.navigateTo('/signin');
        });
    };

    async init () {
        super.init();
        if (window._app.logged) router.navigateTo('/home');
    };
};