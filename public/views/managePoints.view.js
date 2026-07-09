import AppStaffMemberCard from "../components/staffMemberCard.component.js";
import AppWaitingPopup from "../components/waiting.popup.component.js";
import membersService from "../services/members.service.js";
import managePointsViewStyles from "../styles/views/managePoints.view.styles.js";
import managePointsViewTemplate from "../templates/views/managePoints.view.template.js";
import StaffBaseView from "./staff.base.view.js";

window.styles.innerHTML += managePointsViewStyles();

export default class ManagePointsView extends StaffBaseView {
    constructor () {
        super();
        this.view.classList.add('mp-view');
        this.view.innerHTML = managePointsViewTemplate();
        this.memberForm = this.view.querySelector('#member-form');
        this.member = this.view.querySelector('#member');
        this.spinner = new AppWaitingPopup();
        this.memberForm.addEventListener('submit', (e) => this.submit(e));
    };

    async init () {
        await super.init();
    };

    async submit (event) {
        event.preventDefault();

        const input = this.memberForm.querySelector('#member-dni');
        const dni = input.value;
        
        try {
            window.alerts.append(this.spinner);
            const member = await membersService.get({ dni });
            console.log(member);
            this.draw(member);
        } catch (error) {
            console.error(error);
            window.alert(error.message);                
        } finally {
            this.spinner.remove();
        };
    };

    draw (member) {
        this.member.innerHTML = '';
        this.member.append(new AppStaffMemberCard(member));
    };
};