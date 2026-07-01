export default () => {
    return `
        <div class="signup-view">
            <form id="form" class="signup-form">
                <span class="light-text">A continuación podés ingresar tus datos para crear tu cuenta.</span>

                <input id="input-dni" class="input" type="text" placeholder="Número de documento" required />
                <input id="input-names" class="input" type="text" placeholder="Nombre(s)" required />
                <input id="input-surnames" class="input" type="text" placeholder="Apellido(s)" required />
                <input id="input-email" class="input" type="email" placeholder="Correo electrónico" required />
                <input id="input-phone" class="input" type="tel" placeholder="Número de celular" required />
                <input id="input-password" class="input" type="password" placeholder="Contraseña" required />

                <button id="button" class="button" type="submit">Crear tu Cuenta</button>

                <span class="light-text">¿Ya tenés tu cuenta? <span id="link" href="/signin" class="link-text">Iniciá sesión.</span></span>
            </form>
        </div>
    `;
};