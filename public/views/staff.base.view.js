import router from "../router.js";
import BaseView from "./base.view.js";

export default class StaffBaseView extends BaseView {
    constructor () {
        super();
    };

    async init () {
        await super.init();
        // if (!window._app) return;
        // if (!window._app.member) return;
        if (window._app.member.role != 'staff') {
            return router.goToNotFound();
        };
    };
};