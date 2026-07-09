export default () => {
    return `
        <div id="app-header-container" class="app-header-container"></div>

        <main class="main">
            <div class="container">
                <form id="member-form" class="member-form">
                    <input type="text" id="member-dni" class="input" placeholder="Número de documento" required />
                    <button type="submit" class="button">Buscar</button>
                </form>

                <div id="member" class="member"></div>
            </div>
        </main>

        <div id="app-nav-container" class="app-nav-container"></div>
    `;
};