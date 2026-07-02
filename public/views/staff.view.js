import router from "../router.js";
import staffViewStyles from "../styles/views/staff.view.styles.js";
import staffViewTemplate from "../templates/views/staff.view.template.js";
import StaffBaseView from "./staff.base.view.js";

document.querySelector('#styles').innerHTML += staffViewStyles();

export default class StaffView extends StaffBaseView {
    constructor () {
        super();
        this.view.classList.add('staff');
        this.view.innerHTML = staffViewTemplate();

        this.view.querySelector('#button-validate').addEventListener('click', (event) => {
            router.navigateTo('/staff/validate-code');
        });

        this.view.querySelector('#button-new').addEventListener('click', (event) => {
            router.navigateTo('/staff/new-product');
        });

        this.view.querySelector('#button-list').addEventListener('click', (event) => {
            router.navigateTo('/staff/products');
        });
    };

    async init () {
        await super.init();
    };
};