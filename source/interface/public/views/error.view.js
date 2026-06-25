import errorViewStyles from "../styles/views/error.view.styles.js";
import errorViewTemplate from "../templates/views/error.view.template.js";
import BaseView from "./base.view.js";

export default class ErrorView extends BaseView {
    constructor () {
        super();
        this.view.innerHTML = errorViewTemplate()+errorViewStyles();
    };

    async init () {
        super.init();
    };
};