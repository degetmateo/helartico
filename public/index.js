import router from "./router.js";

window.app = {};

const token = localStorage.getItem('token');

if (token) {
    fetch('/api/auth/resume', {
        method: "GET",
        headers: { 'authorization': 'Bearer ' + token }
    })
    .then(async req => {
        const res = await req.json();
        window.app.member = res.data;
        window.app.logged = true;
        router.resolve();
    })
    .catch(err => {
        window.app.logged = false;
        localStorage.clear('token');
        router.navigateTo('/');
        router.resolve();
    });
} else {
    window.app.logged = false;
    router.navigateTo('/');
    router.resolve();
};