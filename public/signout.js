import router from "./router.js";

const signOut = () => {
    localStorage.clear('token');
    window._app.logged = false;
    window._app.member = {};
    window._app.header.updateName('');
    window._app.header.updateNumber(0);
    window._app.nav.hideStaff();
    router.navigateTo('/');
};

export default signOut;