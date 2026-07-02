import AppWaitingPopup from "../components/waiting.popup.component.js";
import staffNewProductViewStyles from "../styles/views/staff.newProduct.view.styles.js";
import staffNewProductViewTemplate from "../templates/views/staff.newProduct.view.template.js";
import StaffBaseView from "./staff.base.view.js";

document.querySelector('#styles').innerHTML += staffNewProductViewStyles();

export default class StaffNewProductView extends StaffBaseView {
    constructor () {
        super();
        this.view.classList.add('staff-new-product-view');
        this.view.innerHTML = staffNewProductViewTemplate();

        this.form = this.view.querySelector('#form');
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.submit();
        });
    };

    async init () {
        super.init();
    };

    async submit () {
        const spinner = new AppWaitingPopup();
        try {
            const name = this.form.querySelector('#name').value;
            const price = this.form.querySelector('#price').value;
            const rewardPouints = this.form.querySelector('#reward-points').value;
            const exchangePoints = this.form.querySelector('#exchange-points').value;

            const imageInput = this.form.querySelector('#product-image');
            const image = imageInput.files[0];
            if (!image) throw new Error("No image.");

            const formData = new FormData();
            formData.append('product-image', image);

            formData.append('name', name);
            formData.append('price', price);
            formData.append('reward_points', rewardPouints);
            formData.append('exchange_points', exchangePoints);

            window.app.append(spinner);

            const req = await fetch('/api/products', {
                method: "POST",
                headers: { 'authorization': 'Bearer ' + localStorage.getItem('token') },
                body: formData
            });
            const res = await req.json();
            if (!req.ok) throw new Error(res.error.message);

            this.form.reset();
            window.alert('Producto creado correctamente.');
        } catch (error) {
            console.error(error);
            window.alert(error.message);
        } finally {
            spinner.remove();
        };
    };
};