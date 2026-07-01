export default () => {
    return `
        <style>
            .profile .main {
                padding-top: 50px;
                padding-bot: 50px;
            }

            .signout-form {
                box-sizing:border-box;
                width:100%;
                padding:10px;

                display:flex;
                flex-direction:column;
                gap:10px;

                align-items:center;
                justify-content:center;

                text-align:center;

                border-bottom:1px solid var(--log-cabin);
            }
        </style>
    `;
};