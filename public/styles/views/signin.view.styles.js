export default () => {
    return `
        <style>
            .signin-view {
                width:100%;
                height:100%;
                display:flex;
                align-items:center;
                justify-content:center;
            }

            .signin-form {
                display:flex;
                flex-direction:column;
                padding:10px;
                gap:10px;
                width:100%;
            }

            @media (min-width:512px) {
                .signin-form {
                    width:512px;
                }
            }
        </style>
    `;
};