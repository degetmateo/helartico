export default () => {
    return `
        <div id="app-header-container" class="app-header-container"></div>

        <main class="main">
            <form id="form" class="form">
                <input id="code-input" class="input code-input" type="text" placeholder="Ingresá el código" required />
                <button type="submit" class="button">Validar Código</button>
            </form>

            <div class="code-data-container">
                <span class="light-text">A continuación podrás ver los datos del último código procesado.</span>
                <span class="code-data-status" id="code-data-status">Estado:</span>
                <span id="code-data-code">Código:</span>
                <span id="code-data-member-name">Nombre:</span>
                <span id="code-data-member-dni">DNI:</span>
                <span id="code-data-product-name">Producto:</span>
                <span id="code-data-product-exchange-points">Puntos canjeados:</span>
            </div>
        </main>

        <div id="app-nav-container" class="app-nav-container"></div>
    `;
};