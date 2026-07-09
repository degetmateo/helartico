export default () => {
    return `
        <div class="app-header-left">
            <i id="back" class="fa-solid fa-circle-left app-header-icon"></i>
            <span id="app-header-name" class="name"></span>
        </div>
        <div class="app-header-right">
            <span id="points" class="points"><span id="app-header-number" class="number">0</span> PUNTOS</span>
        </div>
    `;
};