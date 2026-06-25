import homeViewStyles from "../styles/views/home.view.styles.js";
import homeViewTemplate from "../templates/views/home.view.template.js";
import BaseView from "./base.view.js";

export default class HomeView extends BaseView {
    constructor () {
        super();
        this.view.innerHTML = homeViewTemplate() + homeViewStyles();
        this.view.querySelector('#form').addEventListener('submit', (event) => {
            event.preventDefault();
            this.submit();
        });
    };

    async init () {
        super.init();
        this.view.querySelector('#number').innerHTML = window.app.member.points;
        this.view.querySelector('#name').innerHTML = window.app.member.names;

        
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