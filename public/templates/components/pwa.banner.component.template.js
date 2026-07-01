export default () => {
    return `
        <div class="pwa-content">
            <img src="/public/assets/logo.png" alt="App Icon" class="pwa-icon" />
            <div class="pwa-text">
                <strong id="pwa-text-title" class="heavy-text pwa-title">Instalá nuestra App</strong>
                <span id="pwa-text-instructions" class="light-text pwa-instructions">Accedé más rápido y recibí notificaciones sobre productos, recompensas y ofertas especiales antes que nadie.</span>
            </div>
            <div class="pwa-buttons">
                <button id="pwa-install-button" class="button pwa-button">Instalar</button>
                <button id="pwa-close-button" class="button danger pwa-button">Cerrar</button>
                <button id="pwa-ios-button" class="button pwa-button" style="display:none;">Entendido</button>
            </div>
        </div>
    `;
};