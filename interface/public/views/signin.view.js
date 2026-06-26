import router from "../router.js";
import signinViewStyles from "../styles/views/signin.view.styles.js";
import signinViewTemplate from "../templates/views/signin.view.template.js";
import BaseView from "./base.view.js";

export default class SignInView extends BaseView {
    constructor () {
        super();
        this.view.innerHTML = signinViewTemplate()+signinViewStyles();
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
            const email = this.view.querySelector('#input-email').value;
            const password = this.view.querySelector('#input-password').value;

            router.navigateTo('/signup/waiting');

            const req = await fetch('/api/auth/signin', {
                method: "POST",
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const res = await req.json();
            if (!req.ok) throw new Error(res.error.message);

            form.reset();
            console.log(res);
            localStorage.setItem('token', res.data.token);
            window.app = { 
                member: { 
                    names: res.data.member.names, 
                    surnames: res.data.member.surnames, 
                    points: res.data.member.points 
                } 
            };

            router.navigateTo('/home');
        } catch (error) {
            console.error(error);
            router.navigateTo('/signin');
            window.alert(error.message);
        };
    };
};