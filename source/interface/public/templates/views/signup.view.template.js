export default () => {
    return `
        <div class="signup-view">
            <form id="form" class="signup-form">
                <span>A continuación podés ingresar tus datos para crear tu cuenta.</span>

                <input id="input-dni" class="signup-input" type="text" placeholder="Número de documento" required />
                <input id="input-names" class="signup-input" type="text" placeholder="Nombre(s)" required />
                <input id="input-surnames" class="signup-input" type="text" placeholder="Apellido(s)" required />
                <input id="input-email" class="signup-input" type="email" placeholder="Correo electrónico" required />
                <input id="input-password" class="signup-input" type="password" placeholder="Contraseña" required />

                <button id="button" class="signup-button" type="submit">Crear tu Cuenta</button>
            </form>
        </div>
    `;
};