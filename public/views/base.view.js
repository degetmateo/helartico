export default class BaseView {
    constructor () {
        this.app = document.getElementById('app');
        this.view = document.createElement('div');
        this.view.classList.add('view');
    };

    async init () {
        this.app.innerHTML = '';
        this.app.append(this.view);

        this.headerContainer = this.view.querySelector('#app-header-container');
        this.navContainer = this.view.querySelector('#app-nav-container');

        if (this.headerContainer) this.headerContainer.append(window._app.header);
        if (this.navContainer) this.navContainer.append(window._app.nav);
    };
};