import router from "../router.js";
import signOut from "../signout.js";
import profileViewStyles from "../styles/views/profile.view.styles.js";
import profileViewTemplate from "../templates/views/profile.view.template.js";
import BaseView from "./base.view.js";

document.querySelector('#styles').innerHTML += profileViewStyles();

export default class ProfileView extends BaseView {
    constructor () {
        super();
        this.view.innerHTML = profileViewTemplate();
        this.view.classList.add('profile');

        this.view.querySelector('#signout-form').addEventListener('submit', async (event) => {
            event.preventDefault();
            const memberChoice = await confirm('¿Estás seguro de que querés cerrar la sesión? Tendrás que volver a iniciar sesión si querés seguir usando la aplicación.');
            if (!memberChoice) return;
            signOut();
        });

        this.view.querySelector('#reload-form').addEventListener('submit', async (event) => {
            event.preventDefault();
            const memberChoice = await confirm('¿Estás seguro de que querés recargar la aplicación?');
            if (!memberChoice) return;
            router.reload();
        });
    };

    async init () {
        await super.init();
    };
};