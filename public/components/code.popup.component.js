import codePopupComponentStyles from "../styles/components/code.popup.component.styles.js";
import codePopupComponentTemplate from "../templates/components/code.popup.component.template.js";

document.querySelector('#styles').innerHTML += codePopupComponentStyles();

class AppCodePopup extends HTMLElement {
    constructor (data) {
        super();
        this.classList.add('app-code-popup');
        this.innerHTML = codePopupComponentTemplate(data);

        this.addEventListener('click', (event) => {
            event.preventDefault();
            if (event.target == event.currentTarget) {
                this.remove();
            }
        });
    };
};

customElements.define('app-code-popup', AppCodePopup);
export default AppCodePopup;