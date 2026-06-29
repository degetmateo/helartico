export default () => {
    return `
        <div class="home">
            <header class="header">
                <div class="left">
                    <i id="signout" class="fa-solid fa-arrow-right-from-bracket signout"></i>
                    <span id="name" class="name"></span>
                </div>
                <span id="points home-header-points" class="points"><span id="number" class="number">0</span> PUNTOS</span>
            </header>

            <main class="main">
                <div id="products" class="products">

                </div>
            </main>
        </div>
    `;
};

`
<form class="form" id="form">
    <input type="text" class="input" id="input-search" placeholder="Buscar por nombre" required />
    <button type="submit" class="button"><i class="fa-solid fa-magnifying-glass"></i></button>
</form>
`