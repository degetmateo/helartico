import codeComponentStyles from "../styles/components/code.component.styles.js";
import codeComponentTemplate from "../templates/components/code.component.template.js";

document.querySelector('#styles').innerHTML += codeComponentStyles();

class AppCode extends HTMLElement {
    constructor (data) {
        super();
        this.data = data;
        this.classList.add('app-code');
        this.innerHTML = codeComponentTemplate(data);
    };
};

customElements.define('app-code', AppCode);
export default AppCode;