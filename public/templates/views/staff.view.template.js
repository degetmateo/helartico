export default () => {
    return `
        <div id="app-header-container" class="app-header-container"></div>

        <main class="main">
            <div class="buttons">
                <button type="button" route="/staff/validate-code" class="button">Validar Código</button>
                <button type="button" route="/staff/new-product" class="button">Nuevo Producto</button>
                <button type="button" route="/staff/products" class="button">Lista de Productos</button>
                <button type="button" route="/staff/manage-points" class="button">Gestionar Puntos</button>
            </div>
        </main>

        <div id="app-nav-container" class="app-nav-container"></div>
    `;
};