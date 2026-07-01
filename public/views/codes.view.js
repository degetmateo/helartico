import AppCode from "../components/code.component.js";
import codesViewStyles from "../styles/views/codes.view.styles.js";
import codesViewTemplate from "../templates/views/codes.view.template.js";
import BaseView from "./base.view.js";

document.querySelector('#styles').innerHTML += codesViewStyles();

export default class CodesView extends BaseView {
    constructor () {
        super();
        this.view.classList.add('codes');
        this.view.innerHTML = codesViewTemplate();
        this.codesContainer = this.view.querySelector('#codes-container');
        this.olderCode = null;
    };

    async init () {
        await super.init();
        this.codesContainer.innerHTML = '';
        
        const codes = await this.getCodes();
        this.olderCode = codes[codes.length - 1];

        for (const code of codes) {
            this.codesContainer.append(new AppCode(code));
        };
    };

    async getCodes () {
        try {
            const req = await fetch('/api/codes', {
                method: "GET",
                headers: { 'authorization': 'Bearer ' + localStorage.getItem('token') }
            });
            const res = await req.json();
            if (!req.ok) throw new Error(res.error.message);
            return res.data;
        } catch (error) {
            console.error(error);
            alert(error.message);
            return [];  
        };
    };
};