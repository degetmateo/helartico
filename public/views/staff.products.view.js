import AppWaitingPopup from "../components/waiting.popup.component.js";
import router from "../router.js";
import productsService from "../services/products.service.js";
import service from "../services/service.js";
import staffProductsViewStyles from "../styles/views/staff.products.view.styles.js";
import staffProductsViewTemplate from "../templates/views/staff.products.view.template.js";
import StaffBaseView from "./staff.base.view.js";

document.querySelector('#styles').innerHTML += staffProductsViewStyles();

export default class StaffProductsView extends StaffBaseView {
    constructor () {
        super();
        this.view.classList.add('staff-products-view');
        this.view.innerHTML = staffProductsViewTemplate();
        this.form = this.view.querySelector('#form');
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.submit();
        });
        this.container = this.view.querySelector('#products');
        this.olderProduct = null;

        this.container.addEventListener('click', (event) => {
            event.preventDefault();
            if (event.target.closest('.button-product')) {
                const href = event.target.getAttribute('href');
                if (!href) return;
                return router.navigateTo(href);
            };
        });

        this.button = this.view.querySelector('#show-more-button');
        this.button.addEventListener('click', async (event) => {
            event.preventDefault();
            const spinner = new AppWaitingPopup();
            try {
                window.app.append(spinner);
                const name = this.form.querySelector('#name').value;
                const olderId = this.olderProduct ? this.olderProduct._id : null;
                const products = await productsService.get({ name, olderId });
                if (products.length <= 0) return;
                this.olderProduct = products[products.length - 1];
                this.draw(products);
            } catch (error) {
                console.error(error);
                window.alert(error.message);
            } finally {
                spinner.remove();
            };
        });
    };

    async init () {
        super.init();
        this.submit();
    };

    async submit () {
        const spinner = new AppWaitingPopup();
        try {
            window.app.append(spinner);
            this.olderProduct = null;
            this.container.innerHTML = '';
            const name = this.form.querySelector('#name').value;
            const products = await productsService.get({ name });
            if (products.length <= 0) return;
            this.olderProduct = products[products.length - 1];
            this.draw(products);
        } catch (error) {
            console.error(error);
            window.alert(error.message);
        } finally {
            spinner.remove();
        };
    };

    draw (products) {
        for (const product of products) {
            this.container.innerHTML += `
                <div class="product">
                    <span class="name">${product.name}</span>
                    <button href="/staff/products/${product._id}" class="button button-product" type="button">Editar</button>
                </div>
            `;
        };
    };
};