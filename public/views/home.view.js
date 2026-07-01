import AppProduct from "../components/product.component.js";
import router from "../router.js";
import homeViewStyles from "../styles/views/home.view.styles.js";
import homeViewTemplate from "../templates/views/home.view.template.js";
import BaseView from "./base.view.js";

export default class HomeView extends BaseView {
    constructor () {
        super();
        this.view.innerHTML = homeViewTemplate() + homeViewStyles();
        // this.view.querySelector('#form').addEventListener('submit', (event) => {
        //     event.preventDefault();
        //     this.submit();
        // });
    };

    async init () {
        super.init();

        const req = await fetch('/api/products', { 
            method: "GET",
            headers: { "authorization": 'Bearer ' + localStorage.getItem('token') }
        });
        
        const res = await req.json();

        if (!req.ok) console.error(res.error.message);

        const data = res.data;

        const container = this.view.querySelector('#products');

        container.innerHTML = '';

        for (const p of data) {
            container.append(new AppProduct(p));
        };
    };

    async submit () {
        try {
            const value = this.view.querySelector('#input-search').value;
        } catch (error) {
            console.error(error);
            window.alert(error.message);
        };
    };
};