export default () => {
    return `
        <div class="signin-view">
            <form id="form" class="signin-form">
                <span class="light-text">Iniciá sesión ingresando tus datos a continuación.</span>

                <input id="input-email" class="input" type="email" placeholder="Correo electrónico" required />
                <input id="input-password" class="input" type="password" placeholder="Contraseña" required />

                <button id="button" class="button" type="submit">Iniciar Sesión</button>

                <span class="light-text">¿Todavía no ténes cuenta? <span id="link" href="/signup" class="link-text">Creá tu cuenta ahora.</span></span>
            </form>
        </div>
    `;
};