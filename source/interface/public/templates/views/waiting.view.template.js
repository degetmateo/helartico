import Spinner from "../../components/spinner.component.js";

const spinner = new Spinner();

export default () => {
    return `
        <div class="waiting">
            <div class="waiting-container">
                <div class="waiting-animation-container">${spinner.outerHTML}</div>
                <span class=waiting-message">Por favor, espere...</span>
            </div>
        </div>
    `;
};