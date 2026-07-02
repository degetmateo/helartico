import staffProductsViewTemplate from "../templates/views/staff.products.view.template.js";
import StaffBaseView from "./staff.base.view.js";

export default class StaffProductsView extends StaffBaseView {
    constructor () {
        super();
        this.view.innerHTML = staffProductsViewTemplate();
    };

    async init () {
        super.init();
    };
};