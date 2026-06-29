import router from "../router.js";
import signupViewStyles from "../styles/views/signup.view.styles.js";
import signupViewTemplate from "../templates/views/signup.view.template.js";
import BaseView from "./base.view.js";

export default class SignUpView extends BaseView {
    constructor () {
        super();
        this.view.innerHTML = signupViewTemplate()+signupViewStyles();

        this.view.querySelector('#form').addEventListener('submit', (event) => {
            event.preventDefault();
            this.submit();
        });
    };

    async init () {
        super.init();
    };

    async submit () {
        try {
            const form = this.view.querySelector('#form');
            if (!form.checkValidity()) return window.alert('Tenés que completar el formulario.');         

            const dni = this.view.querySelector('#input-dni').value;
            const names = this.view.querySelector('#input-names').value;
            const surnames = this.view.querySelector('#input-surnames').value;
            const email = this.view.querySelector('#input-email').value;
            const phone = this.view.querySelector('#input-phone').value;
            const password = this.view.querySelector('#input-password').value;

            form.reset();
            router.navigateTo('/signup/waiting');

            const req = await fetch('/api/members/signup', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    dni,
                    names,
                    surnames,
                    email,
                    phone,
                    password
                })
            });

            const res = await req.json();
            if (!req.ok) throw new Error(res.error.message);
            
            localStorage.setItem('token', res.data.token);
            window.app = { 
                member: { 
                    names: res.data.member.names, 
                    surnames: res.data.member.surnames,
                    points: res.data.member.points 
                } 
            };
            
            router.navigateTo('/home');
            window.alert('Tu cuenta se creó correctamente.');
        } catch (error) {
            console.error(error);
            router.navigateTo('/signup');
            window.alert(error.message);
        };
    };
};