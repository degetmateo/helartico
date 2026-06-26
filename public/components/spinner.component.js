import spinnerComponentStyles from "../styles/components/spinner.component.styles.js";
import spinnerComponentTemplate from "../templates/components/spinner.component.template.js";

class Spinner extends HTMLElement {
    constructor () {
        super();
        this.innerHTML = spinnerComponentTemplate()+spinnerComponentStyles();
        this.classList.add('loader');
    };
};

customElements.define('app-spinner', Spinner);
export default Spinner;