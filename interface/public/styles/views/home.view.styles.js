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

            .home .header {
                width: 100%;
                box-sizing:border-box;
                padding:0 15px;
                height: 50px;
                background-color: var(--color-main);
                border-bottom: 1px solid var(--color-hover);

                display:flex;
                flex-direction:row;
                align-items:center;
                justify-content:space-between;

                position: absolute;
                top: 0;
                left: 0;

                z-index:1;
            }

            .home .header .points .number {
                font-weight:bold;
            }

            .home .header .signout {
                font-size: 18px;
                padding:4px;
                border-radius:5px;
                border:2px solid var(--color-main-darker);
            }

            .home .main {
                position:relative;
                top:50px;
                display:flex;
                flex-direction:column;

                width:100%;
            }

            .home .main .form {
                padding:10px;
                display:flex;
                align-items:center;
                justify-content:center;
                border-bottom:1px solid var(--color-hover);
            }

            .home .main .form .input {
                padding:10px;
                border-radius:10px;
                outline:1px solid #000;
                border:none;
            }

            .home .main .form .input:focus {
                border:none;
                outline: 3px solid brown;
            }

            .home .main .products {
                padding: 10px;
                box-sizing:border-box;

                display: flex;
                flex-direction: column;
                align-items:center;
                gap:10px;
            }
        </style>
    `;
};