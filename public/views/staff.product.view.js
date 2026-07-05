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

        this.name = this.view.querySelector('#name');
        this.price = this.view.querySelector('#price');
        this.reward = this.view.querySelector('#reward');
        this.exchange = this.view.querySelector('#exchange');
        this.image = this.view.querySelector('#image');

        this.formName = this.view.querySelector('#form-name');
        this.formPrice = this.view.querySelector('#form-price');
        this.formReward = this.view.querySelector('#form-reward');
        this.formExchange = this.view.querySelector('#form-exchange');
        this.formImage = this.view.querySelector('#form-image');

        this.spinner = new AppWaitingPopup();

        this.formName.addEventListener('submit', async (event) => {
            event.preventDefault();
            try {
                window.app.append(this.spinner);
                await productsService.update.name(this.meta.data._id, this.name.value);
                window.alert('Nombre del producto actualizado correctamente.');
            } catch (error) {
                console.error(error);
                window.alert(error.message);
            } finally {
                this.spinner.remove();
            };
        });

        this.formPrice.addEventListener('submit', async (event) => {
            event.preventDefault();
            try {
                window.app.append(this.spinner);
                await productsService.update.price(this.meta.data._id, this.price.value);
                window.alert('Precio del producto actualizado correctamente.');
            } catch (error) {
                console.error(error);
                window.alert(error.message);
            } finally {
                this.spinner.remove();
            };
        });

        this.formReward.addEventListener('submit', async (event) => {
            event.preventDefault();
            try {
                window.app.append(this.spinner);
                await productsService.update.reward(this.meta.data._id, this.reward.value);
                window.alert('Recompensa del producto actualizada correctamente.');
            } catch (error) {
                console.error(error);
                window.alert(error.message);
            } finally {
                this.spinner.remove();
            };
        });

        this.formExchange.addEventListener('submit', async (event) => {
            event.preventDefault();
            try {
                window.app.append(this.spinner);
                await productsService.update.exchange(this.meta.data._id, this.exchange.value);
                window.alert('Puntos de canje del producto actualizada correctamente.');
            } catch (error) {
                console.error(error);
                window.alert(error.message);
            } finally {
                this.spinner.remove();
            };
        });

        this.formImage.addEventListener('submit', async (event) => {
            event.preventDefault();
            try {
                window.app.append(this.spinner);
                await productsService.update.image(this.meta.data._id, this.image.files[0]);
                this.formImage.reset();
                window.alert('Imagen del producto actualizada correctamente.');
            } catch (error) {
                console.error(error);
                window.alert(error.message);
            } finally {
                this.spinner.remove();
            };
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
        this.name.value = product.name;
        this.price.value = product.price;
        this.reward.value = product.reward_points;
        this.exchange.value = product.exchange_points;
        console.log(product);
    };
};