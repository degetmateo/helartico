export default () => {
    return `
        <div class="home">
            <header class="header">
                <span id="name" class="name"></span>
                <i id="signout" class="fa-solid fa-arrow-right-from-bracket signout"></i>
                <span id="points" class="points"><span id="number" class="number">0</span> PUNTOS</span>
            </header>

            <main class="main">
                <form class="form" id="form">
                    <input type="text" class="input" id="input-search" placeholder="Buscar por nombre" required />
                </form>

                <div id="products" class="products">

                </div>
            </main>
        </div>
    `;
};