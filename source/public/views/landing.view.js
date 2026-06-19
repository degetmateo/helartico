import landingViewStyles from "../styles/views/landing.view.styles.js";
import landingViewTemplate from "../templates/views/landing.view.template.js";
import BaseView from "./base.view.js";

export default class LandingView extends BaseView {
    constructor () {
        super();
        this.view.innerHTML = landingViewTemplate()+landingViewStyles();
    };

    async init () {
        super.init();
    };
};