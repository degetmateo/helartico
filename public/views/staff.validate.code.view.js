import AppWaitingPopup from "../components/waiting.popup.component.js";
import staffValidateCodeViewStyles from "../styles/views/staff.validate.code.view.styles.js";
import staffValidateCodeViewTemplate from "../templates/views/staff.validate.code.view.template.js";
import StaffBaseView from "./staff.base.view.js";

document.querySelector('#styles').innerHTML += staffValidateCodeViewStyles();

export default class StaffValidateCodeView extends StaffBaseView {
    constructor () {
        super();
        this.view.classList.add('staff-validate-code-view');
        this.view.innerHTML = staffValidateCodeViewTemplate();

        this.codeInput = this.view.querySelector('#code-input');

        this.form = this.view.querySelector('#form');
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.validateCode();
        });

        this.dataCode = this.view.querySelector('#code-data-code');
        this.dataMemberName = this.view.querySelector('#code-data-member-name');
        this.dataMemberDNI = this.view.querySelector('#code-data-member-dni');
        this.dataProductName = this.view.querySelector('#code-data-product-name');
        this.dataExchangePoints = this.view.querySelector('#code-data-product-exchange-points');
        this.dataStatus = this.view.querySelector('#code-data-status');
    };

    async init () {
        await super.init();
    };

    async validateCode () {
        const spinner = new AppWaitingPopup();
        try {
            const code = this.codeInput.value;
            if (code.length != 8) throw new Error("Código inválido. Debe ser de 8 carácteres.");
            
            window.app.append(spinner);

            const req = await fetch('/api/codes/validate-code?code='+code, {
                method: "GET",
                headers: {
                    'authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            const res = await req.json();
            if (!req.ok) throw new Error(res.error.message);
            this.drawCodeData(res.data);
        } catch (error) {
            console.error(error);
            window.alert(error.message);
        } finally {
            spinner.remove();
        };
    };

    drawCodeData (data) {
        const status = data.status === 'RECLAIMED' ?
            'success' :
            'error';

        const map = {
            "success": "ÉXITO",
            "error": "ERROR"
        };

        this.dataStatus.innerHTML = `Estado: <span class="status-${status}">${map[status]}</span>`;
        this.dataCode.innerHTML = `Código: <b>${data.code}</b>`;
        this.dataMemberName.innerHTML = `Nombre: <b>${data.member.names} ${data.member.surnames}</b>`;
        this.dataMemberDNI.innerHTML = `DNI: <b>${data.member.dni}</b>`;
        this.dataProductName.innerHTML = `Producto: <b>${data.product.name}</b>`;
        this.dataExchangePoints.innerHTML = `Puntos canjeados: <b>${data.product.exchange_points}</b>`;
    };
};