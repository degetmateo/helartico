import productComponentStyles from "../styles/components/product.component.styles.js";
import productComponentTemplate from "../templates/components/product.component.template.js";
import AppCodePopup from "./code.popup.component.js";

document.querySelector('#body').innerHTML += productComponentStyles();

class AppProduct extends HTMLElement {
    constructor (data) {
        super();
        this.data = data;
        this.classList.add('product');
        this.innerHTML = productComponentTemplate(data);

        this.button = this.querySelector('#button');
        this.button.addEventListener('click', (event) => {
            event.preventDefault();
            this.exchange();
        });
    };

    async exchange () {
        try {
            const userChoice = await confirm(`¿Querés canjear ${this.data.name} por ${this.data.exchange_points} puntos?`);
            if (!userChoice) return;

            if (window._app.member.points < this.data.exchange_points) {
                throw new Error('Tus puntos no son suficientes para canjear este producto.');
            };

            const req = await fetch(`/api/products/exchange/${this.data._id}`, { 
                method: "GET",
                headers: { 'authorization': 'Bearer ' + localStorage.getItem('token') }
            });
            
            const res = await req.json();
            if (!req.ok) throw new Error(res.error.message);
            
            window._app.member.points = res.data.remaining_points;
            
            document.dispatchEvent(new CustomEvent('app-points', {
                detail: {
                    points: res.data.remaining_points
                }
            }));

            const code = res.data.code;
            window.app.append(new AppCodePopup(res.data));
        } catch (error) {
            console.error(error);
            alert(error.message);
        };
    };
};

customElements.define('app-product', AppProduct);
export default AppProduct;