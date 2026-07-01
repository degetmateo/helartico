import AppPWAInstallBanner from "../components/pwa.install.banner.component.js";
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

        const isInStandaloneMode = () => {
            return ('standalone' in window.navigator) && (window.navigator.standalone);
        };

        const installed = localStorage.getItem('pwa') === 'installed';

        if ((!installed) && !isInStandaloneMode()) {
            window._app.pwa_banner = new AppPWAInstallBanner();
            window.app.append(window._app.pwa_banner);
        };

        if (isInStandaloneMode()) {
            localStorage.setItem('pwa', 'installed');
            if (window._app.pwa_banner) window._app.pwa_banner.remove();
            window._app.pwa_banner = null;
        };
    };
};