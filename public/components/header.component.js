import router from "../router.js";
import headerComponentStyles from "../styles/components/header.component.styles.js";
import headerComponentTemplate from "../templates/components/header.component.template.js";

document.querySelector('#styles').innerHTML += headerComponentStyles();

class AppHeader extends HTMLElement {
    constructor () {
        super();
        this.classList.add('app-header');

        this.innerHTML = headerComponentTemplate();

        this.querySelector('#back').addEventListener('click', (event) => {
            event.preventDefault();
            router.goBack();
        });

        this.pointsNumber = this.querySelector('#app-header-number');
        this.memberName = this.querySelector('#app-header-name');

        document.addEventListener('app-points', (e) => {
            const data = e.detail;
            this.updateNumber(data.points);
        });
    };

    updateNumber (number) {
        this.pointsNumber.innerHTML = number;
    };

    updateName (name) {
        this.memberName.innerHTML = name;
    };
};

customElements.define('app-header', AppHeader);
export default AppHeader;