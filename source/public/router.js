import LandingView from "./views/landing.view.js";

class Router {
    constructor () {
        this.router = new Navigo("/", { hash: true });
        this.event = new Event('pathnamechange');

        this.views = {
            landing: new LandingView()
            // error: new ErrorView(),
            // home: new HomeView(),
            // products: new ProductsView(),
            // cart: new CartView()
        };

        this.router
            .on("/", () => this.views.landing.init())
            // .on('/products', (meta) => this.views.products.init(meta))
            // .on('/cart', () => this.views.cart.init())
            // .notFound(() => this.views.error.init());
    };

    resolve = () => {
        this.router.resolve();
    };

    navigateTo = (url) => {
        if (url == window.location.pathname) return;
        window.history.pushState(null, null, url);
        window.dispatchEvent(this.event);
        this.resolve();
    };

    replace = (url) => {
        if (url == window.location.pathname) return;
        window.history.replaceState(null, null, url);
        window.dispatchEvent(this.event);
        this.resolve();
    };

    goBack = () => {
        window.history.back();
    };

    goForward = () => {
        window.history.forward();
    };

    getPathname = () => {
        return window.location.pathname;
    };

    reload = () => {
        window.location.reload();
    };
};

export default new Router();