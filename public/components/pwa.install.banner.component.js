import pwaBannerComponentStyles from "../styles/components/pwa.banner.component.styles.js";
import pwaBannerComponentTemplate from "../templates/components/pwa.banner.component.template.js";

document.querySelector('#styles').innerHTML += pwaBannerComponentStyles();

class AppPWAInstallBanner extends HTMLElement {
    constructor () {
        super();
        this.classList.add('app-pwa');
        this.innerHTML = pwaBannerComponentTemplate();

        this.installButton = this.querySelector('#pwa-install-button');
        this.closeButton = this.querySelector('#pwa-close-button');
        this.iosButton = this.querySelector('#pwa-ios-button');
        this.titleText = this.querySelector('#pwa-text-title');
        this.instructionsText = this.querySelector('#pwa-text-instructions');

        this.installButton.addEventListener('click', (event) => {
            this.install();
        });

        this.closeButton.addEventListener('click', (event) => {
            this.remove();
        });

        this.iosButton.addEventListener('click', (event) => {
            this.remove();
        });
    };

    async install () {
        const isIos = () => {
            const userAgent = window.navigator.userAgent.toLowerCase();
            return /iphone|ipad|ipod/.test(userAgent); 
        };

        const getIosBrowser = () => {
            const ua = window.navigator.userAgent.toLowerCase();
            if (ua.includes('crios')) return 'chrome';
            if (ua.includes('fxios')) return 'firefox';
            if (ua.includes('edgios')) return 'edge';
            if (ua.includes('safari') && !ua.includes('crios') && !ua.includes('fxios')) return 'safari';
            return 'unknown';
        };

        if (isIos()) {
            this.titleText.innerHTML = 'Instrucciones para instalar en IOS';
            this.installButton.style.display = 'none';
            this.closeButton.style.display = 'none';
            this.iosButton.style.display = 'unset';

            const browser = getIosBrowser();
            let instructions = '';

            switch (browser) {
                case 'safari':
                    instructions = `Tocá los tres puntitos, luego en <strong>Compartir</strong>, luego en <strong>Ver más</strong> y por último en <strong>Agregar a Inicio</strong>.`;
                    break;
                case 'chrome':
                    instructions = `Tocá en <strong>Compartir</strong> (arriba a la derecha), luego en <strong>Ver más</strong> y por último en <strong>Añadir a pantalla de inicio</strong>.`;
                    break;
                default:
                    instructions = `Abre el menú de opciones de tu navegador y selecciona <strong>"Añadir a pantalla de inicio"</strong>.`;
                    break;
            };

            this.instructionsText.innerHTML = instructions;
        } else {
            const deferredPrompt = window._app.pwa_event;
    
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    localStorage.setItem('pwa', 'installed');
                };
                window._app.pwa_event = null;
            };
        };
    };
};

customElements.define('app-pwa-install-banner', AppPWAInstallBanner);
export default AppPWAInstallBanner;