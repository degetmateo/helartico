export default class BaseView {
    constructor () {
        this.app = document.getElementById('app');
        this.view = document.createElement('div');
        this.view.classList.add('view');
    };

    async init () {
        this.app.innerHTML = '';
        this.app.append(this.view);
    };
};