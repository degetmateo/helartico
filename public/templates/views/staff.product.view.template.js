export default () => {
    return `
        <div id="app-header-container" class="app-header-container"></div>

        <main class="main">
            <div class="container">
                <form id="form" class="form">
                    <div class="input-container">
                        <span class="light-text">Editar el nombre.</span>
                        <input id="name" class="input" type="text" placeholder="Nombre del producto" required />
                    </div>

                    <div class="input-container">
                        <span class="light-text">Editar el precio.</span>
                        <input id="price" class="input" type="number" min="0" placeholder="Precio del producto" required />
                    </div>

                    <div class="input-container">
                        <span class="light-text">Editar los puntos que se dan al comprarlo.</span>
                        <input id="reward" class="input" type="number" min="0" placeholder="Puntos de recompensa" required />
                    </div>

                    <div class="input-container">
                        <span class="light-text">Editar los puntos para canjearlo.</span>
                        <input id="exchange" class="input" type="number" min="0" placeholder="Puntos para canjear" required />
                    </div>

                    <div class="input-container">
                        <span class="light-text">Actualizar imagen del producto.</span>
                        <input id="image" class="input" type="file" accept="image/*" required />
                    </div>

                    <button type="submit" class="button">Actualizar Producto</button>
                </form>
            </div>
        </main>

        <div id="app-nav-container" class="app-nav-container"></div>
    `;
};