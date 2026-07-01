document.querySelector('#styles').innerHTML += `
    <style>
        .loader {
            width: 48px;
            height: 48px;
            border: 5px solid #FFF;
            border-bottom-color: var(--color-main-darker);
            border-radius: 50%;
            display: inline-block;
            box-sizing: border-box;
            animation: rotation 1s linear infinite;
        }

        @keyframes rotation {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }

        .popup {
            max-width: 512px;
            box-sizing: border-box;
            padding: 20px;
            border: 1px solid var(--log-cabin);
            border-radius: 5px;
            display:flex;
            gap:20px;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            background-color: var(--bay-leaf);
        }
    </style>
`;

class AppWaitingPopup extends HTMLElement {
    constructor (message) {
        super();
        this.classList.add('app-waiting-popup');
        this.classList.add('popup-container');
        this.innerHTML = `
            <div class="popup">
                <div class="loader"></div>
                <span class="heavy-text">${message || 'Por favor, espere...'}</span>
            </div>
        `;
    };
};

customElements.define('app-waiting-popup', AppWaitingPopup);
export default AppWaitingPopup;