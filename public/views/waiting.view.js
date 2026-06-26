import waitingViewStyles from "../styles/views/waiting.view.styles.js";
import waitingViewTemplate from "../templates/views/waiting.view.template.js";
import BaseView from "./base.view.js";

export default class WaitingView extends BaseView {
    constructor () {
        super();
        this.view.innerHTML = waitingViewTemplate()+waitingViewStyles();
    };

    async init () {
        super.init();
    };
};