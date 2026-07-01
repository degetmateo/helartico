const signIn = (member) => {
    window._app.member = member;
    window._app.logged = true;
    window._app.header.updateName(window._app.member.names);
    window._app.header.updateNumber(window._app.member.points);
};

export default signIn;