export default () => {
    return `
        <div id="app-header-container" class="app-header-container"></div>

        <main class="main">
            <div class="container">
                <form id="form-name" class="form">
                    <span class="light-text">Editar el nombre.</span>
                    <div class="input-container">
                        <input id="name" class="input" type="text" placeholder="Nombre del producto" required />
                        <button class="button" type="submit">Editar</button>
                    </div>
                </form>

                <form id="form-price" class="form">
                    <span class="light-text">Editar el precio.</span>
                    <div class="input-container">
                        <input id="price" class="input" type="number" min="0" placeholder="Precio del producto" required />
                        <button class="button" type="submit">Editar</button>
                    </div>
                </form>

                <form id="form-reward" class="form">
                    <span class="light-text">Editar los puntos que se dan al comprarlo.</span>
                    <div class="input-container">
                        <input id="reward" class="input" type="number" min="0" placeholder="Puntos de recompensa" required />
                        <button class="button" type="submit">Editar</button>
                    </div>
                </form>

                <form id="form-exchange" class="form">
                    <span class="light-text">Editar los puntos para canjearlo.</span>
                    <div class="input-container">
                        <input id="exchange" class="input" type="number" min="0" placeholder="Puntos para canjear" required />
                        <button class="button" type="submit">Editar</button>
                    </div>
                </form>

                <form id="form-image" class="form">
                    <span class="light-text">Actualizar imagen del producto. Se reemplazará sobre la que tiene actualmente.</span>
                    <div class="input-container">
                        <input id="image" class="input" type="file" accept="image/*" required />
                        <button class="button" type="submit">Editar</button>
                    </div>
                </form>
            </div>
        </main>

        <div id="app-nav-container" class="app-nav-container"></div>
    `;
};