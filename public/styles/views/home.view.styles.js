export default () => {
    return `
        <style>
            .home {
                width: 100dvw;
                height: 100dvh;

                display:flex;
                flex-direction:column;

                align-items:center;

                overflow-y:auto;
            }
            
            .home .header .signout {
                font-size: 18px;
                padding:4px;
                border-radius:5px;
                border:2px solid var(--log-cabin);
            }

            .home .main {
                // position:relative;
                // top:50px;

                padding-top: 50px;
                padding-bottom:50px;

                display:flex;
                flex-direction:column;

                width:100%;
            }

            .home .main .form {
                padding:10px;

                display:flex;
                flex-direction:row;
                align-items:center;
                justify-content:center;
                gap:10px;
                // border-bottom:1px solid var(--color-hover);
            }

            .home .main .products {
                display: flex;
                flex-direction: column;
                align-items:center;
                // gap:20px;
            }
        </style>
    `;
};