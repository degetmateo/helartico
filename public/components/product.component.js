import productComponentStyles from "../styles/components/product.component.styles.js";
import productComponentTemplate from "../templates/components/product.component.template.js";

document.querySelector('#body').innerHTML += productComponentStyles();

class AppProduct extends HTMLElement {
    constructor (data) {
        super();
        this.data = data;
        this.classList.add('product');
        this.innerHTML = productComponentTemplate(data);
    };
};

customElements.define('app-product', AppProduct);
export default AppProduct;