export default () => {
    return `
        <div class="landing-view">
            <div class="landing-container">
                <div class="landing-logo-container">
                    <img class="landing-logo" src="/public/assets/logo.jpeg" alt="helartico logo" />
                </div>

                <span class="message">¿Es tu primera vez? Creá tu cuenta.</span>
                <button class="button" id="landing-button-signup">Crear tu Cuenta</button>
                <span class="message">¿Ya tenés una cuenta? Iniciá sesión.</span>
                <button class="button" id="landing-button-signin">Iniciar Sesión</button>
            </div>
        </div>
    `;
};