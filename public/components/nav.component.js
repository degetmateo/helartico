import router from "../router.js";
import navComponentStyles from "../styles/components/nav.component.styles.js";
import navComponentTemplate from "../templates/components/nav.component.template.js";

document.querySelector('#styles').innerHTML += navComponentStyles();

class AppNav extends HTMLElement {
    constructor () {
        super();
        this.classList.add('app-nav');
        this.innerHTML = navComponentTemplate();

        this.buttons = this.querySelectorAll('.nav-button');
        this.buttons.forEach((button) => {
            button.addEventListener('click', (event) => {
                const href = event.currentTarget.getAttribute('href');
                router.navigateTo(href);
            });
        });
    };
};

customElements.define('app-nav', AppNav);
export default AppNav;