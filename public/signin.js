import router from "./router.js";

const signIn = (member) => {
    window._app.member = member;
    window._app.logged = true;
    window._app.header.updateName(window._app.member.names);
    window._app.header.updateNumber(window._app.member.points);
    if (member.role === 'staff') {
        window._app.nav.showStaff();
    };
};

export default signIn;