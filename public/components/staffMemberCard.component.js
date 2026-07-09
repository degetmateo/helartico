import membersService from "../services/members.service.js";
import staffMemberCardComponentStyles from "../styles/components/staffMemberCard.component.styles.js";
import staffMemberCardComponentTemplate from "../templates/components/staffMemberCard.component.template.js";
import AppWaitingPopup from "./waiting.popup.component.js";

window.styles.innerHTML += staffMemberCardComponentStyles();

class AppStaffMemberCard extends HTMLElement {
    constructor (member) {
        super();

        this.member = member;
        this.classList.add('app-staff-member-card');
        this.innerHTML = staffMemberCardComponentTemplate(this.member);

        this.points = this.querySelector('#member-points');

        const formAddPoints = this.querySelector('#form-add-points');
        const formSetPoints = this.querySelector('#form-set-points');
        
        const inputAddPoints = formAddPoints.querySelector('#input-add-points');
        const inputSetPoints = formSetPoints.querySelector('#input-set-points');

        this.spinner = new AppWaitingPopup();

        formAddPoints.addEventListener('submit', async (event) => {
            event.preventDefault();
            const points = inputAddPoints.value;
            
            const memberChoice = await confirm(`¿Estás seguro de que querés SUMAR ${points} PUNTOS al usuario ${member.names} ${member.surnames}?`);
            if (!memberChoice) return;

            try {
                window.alerts.append(this.spinner);
                const res = await membersService.points.add({ _id: member._id, points });
                this.member.points = res.new_points;
                this.points.innerHTML = `PUNTOS ACTUALES: <b>${res.new_points}</b>`;
                formAddPoints.reset();
            } catch (error) {
                console.error(error);
                alert(error.message);
            } finally {
                this.spinner.remove();
            };
        });
        
        formSetPoints.addEventListener('submit', async (event) => {
            event.preventDefault();
            const points = inputSetPoints.value;

            const memberChoice = await confirm(`ATENCIÓN: Vas a ESTABLECER los puntos de ${member.names} ${member.surnames} a ${points} PUNTOS. Los puntos que el usuario tenga actualmente se REEMPLAZARÁN. ¿Estás seguro de realizar esta acción?`);
            if (!memberChoice) return;

            try {
                window.alerts.append(this.spinner);
                const res = await membersService.points.set({ _id: member._id, points });
                this.member.points = res.new_points;
                this.points.innerHTML = `PUNTOS ACTUALES: <b>${res.new_points}</b>`;
                formSetPoints.reset();
            } catch (error) {
                console.error(error);
                alert(error.message);
            } finally {
                this.spinner.remove();
            };
        });
    };
};

customElements.define('app-staff-member-card', AppStaffMemberCard);
export default AppStaffMemberCard;