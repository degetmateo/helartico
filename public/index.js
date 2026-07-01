import AppHeader from "./components/header.component.js";
import AppNav from "./components/nav.component.js";
import AppPWAInstallBanner from "./components/pwa.install.banner.component.js";
import router from "./router.js";
import signIn from "./signin.js";

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/public/sw.js')
            .then((registration) => {
                console.log('¡Service Worker registrado con éxito! Alcance (scope):', registration.scope);
            })
            .catch((error) => {
                console.error('El registro del Service Worker falló:', error);
            });
    });
} else {
    console.warn('Este navegador no soporta Service Workers.');
};

window._app = {};
window._app.header = new AppHeader();
window._app.nav = new AppNav();

window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    window._app.pwa_event = event;
    localStorage.clear('before pwa');
});

window.addEventListener('appinstalled', () => {
    localStorage.setItem('pwa', 'installed');
    if (window._app.pwa_banner) window._app.pwa_banner.remove();
    window._app.pwa_banner = null;
    console.log('pwa installed');
});

router.init();

const token = localStorage.getItem('token');

if (token) {
    fetch('/api/auth/resume', {
        method: "GET",
        headers: { 'authorization': 'Bearer ' + token }
    })
    .then(async req => {
        const res = await req.json();
        signIn(res.data);
        router.resolve();
    })
    .catch(err => {
        window._app.logged = false;
        localStorage.clear('token');
        router.navigateTo('/');
        router.resolve();
    });
} else {
    window._app.logged = false;
    router.navigateTo('/');
    router.resolve();
};