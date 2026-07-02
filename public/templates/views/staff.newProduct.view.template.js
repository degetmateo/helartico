export default () => {
    return `
        <div id="app-header-container" class="app-header-container"></div>

        <main class="main">
            <form id="form" class="form">
                <div class="input-container">
                    <span class="light-text">Nombre del producto.</span>
                    <input id="name" class="input" type="text" placeholder="Nombre del producto" required />
                </div>

                <div class="input-container">
                    <span class="light-text">Precio del producto.</span>
                    <input id="price" class="input" type="number" min="0" placeholder="Precio del producto" required />
                </div>

                <div class="input-container">
                    <span class="light-text">Puntos que da el producto al comprarlo.</span>
                    <input id="reward-points" class="input" type="number" min="0" placeholder="Puntos de recompensa" required />
                </div>

                <div class="input-container">
                    <span class="light-text">Puntos que son necesarios para canjear el producto.</span>
                    <input id="exchange-points" class="input" type="number" min="0" placeholder="Puntos para canjear" required />
                </div>

                <div class="input-container">
                    <span class="light-text">Imagen del producto.</span>
                    <input id="product-image" class="input" type="file" accept="image/*" required />
                </div>

                <button type="submit" class="button">Crear Producto</button>
            </form>
        </main>

        <div id="app-nav-container" class="app-nav-container"></div>
    `;
};