import AppWaitingPopup from "../components/waiting.popup.component.js";
import productsService from "../services/products.service.js";
import staffProductViewStyles from "../styles/views/staff.product.view.styles.js";
import staffProductViewTemplate from "../templates/views/staff.product.view.template.js";
import StaffBaseView from "./staff.base.view.js";

document.querySelector('#styles').innerHTML += staffProductViewStyles();

export default class StaffProductView extends StaffBaseView {
    constructor () {
        super();
        this.view.classList.add('staff-product-view');
        this.view.innerHTML = staffProductViewTemplate();

        this.form = this.view.querySelector('#form');
        this.name = this.form.querySelector('#name');
        this.price = this.form.querySelector('#price');
        this.reward = this.form.querySelector('#reward');
        this.exchange = this.form.querySelector('#exchange');
        this.image = this.form.querySelector('#image');

        this.form.addEventListener('submit', (event) =>{
            event.preventDefault();
            window.alert('FUNCIÓN NO IMPLEMENTADA.');
        });
    };

    async init (meta) {
        await super.init();
        this.meta = meta;

        const spinner = new AppWaitingPopup();
        const _id = meta.data._id;

        try {
            window.app.append(spinner);
            const product = await productsService.get({ _id });
            if (product.length <= 0 || !product[0]) throw new Error('No existe tal producto.');
            this.draw(product[0]);
        } catch (error) {
            console.error(error);
            window.alert(error.message);
        } finally {
            spinner.remove();
        };
    };

    draw (product) {
        // if (product.image) this.image.src = product.image.url;
        console.log(product);
    };
};