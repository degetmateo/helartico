export default () => {
    return `
        <div class="signin-view">
            <form id="form" class="signin-form">
                <span>Iniciá sesión ingresando tus datos a continuación.</span>

                <input id="input-email" class="signin-input" type="email" placeholder="Correo electrónico" required />
                <input id="input-password" class="signin-input" type="password" placeholder="Contraseña" required />

                <button id="button" class="signin-button" type="submit">Iniciar Sesión</button>
            </form>
        </div>
    `;
};