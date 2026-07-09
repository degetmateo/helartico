export default () => {
    return `
        <div id="app-header-container" class="app-header-container"></div>

        <main class="main">
            <form id="signout-form" class="signout-form">
                <span class="light-text">Cerrar la sesión de tu cuenta. Tendrás que volver a iniciar sesión si querés seguir usando la aplicación.</span>
                <button class="button danger" type="submit">CERRAR SESIÓN</button>
            </form>
            <form id="reload-form" class="signout-form">
                <span class="light-text">Recargar la aplicación en caso de alguna falla.</span>
                <button class="button" type="submit">Recargar Aplicación</button>
            </form>
        </main>

        <div id="app-nav-container" class="app-nav-container"></div>
    `;
};