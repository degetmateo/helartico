export default () => {
    return `
        <div id="app-header-container" class="app-header-container"></div>

        <main class="main">
            <div class="container">
                <form id="form" class="form">
                    <input id="name" class="input" type="text" placeholder="Buscar por nombre" />
                    <button type="submit" class="button">Buscar</button>
                </form>
                
                <div id="products" class="products">
                
                </div>

                <div class="button-container">
                    <button id="show-more-button" class="button" type="button">Ver más</button>
                </div>
            </div>
        </main>

        <div id="app-nav-container" class="app-nav-container"></div>
    `;
};