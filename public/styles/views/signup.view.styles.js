export default () => {
    return `
        <style>
            .signup-view {
                width:100%;
                height:100%;
                display:flex;
                align-items:center;
                justify-content:center;
            }

            .signup-form {
                display:flex;
                flex-direction:column;
                padding:10px;
                gap:10px;
                width:100%;
            }

            @media (min-width:512px) {
                .signup-form {
                    width:512px;
                }
            }
        </style>
    `;
};